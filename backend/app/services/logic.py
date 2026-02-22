import os
from google import genai
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import DBSCAN
import json
import asyncio

load_dotenv()

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
import certifi
mongo_client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"), tlsCAFile=certifi.where())
db = mongo_client["ClassroomSense"]

MODEL_ID = "gemini-2.5-flash-lite"

def _parse_json_response(text: str | None) -> dict:
    if not text:
        return {}
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        if len(lines) >= 2 and lines[-1].startswith("```"):
            cleaned = "\n".join(lines[1:-1])
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {}

api_lock = asyncio.Lock()

"""
Batch Sentiment Classification
"""
async def batch_classify_sentiments(notes_dict: dict):
    if not notes_dict:
        return {}
    notes_str = "\n".join([f'"{sid}": "{text}"' for sid, text in notes_dict.items()])
    prompt = f"""
        You are an academic sentiment classifier.
        Classify the following classroom notes into: CONFUSION, UNDERSTOOD, UNANSWERED_QUESTION.
        Return ONLY valid JSON mapping the student ID to their classification:
        {{
            "student_id_1": {{ "sentiment": "...", "confidence": float }},
            "student_id_2": {{ "sentiment": "...", "confidence": float }}
        }}
        
        Notes:
        {notes_str}
    """

    async with api_lock:
        await asyncio.sleep(8)
        response = gemini_client.models.generate_content(
            model=MODEL_ID, 
            contents=prompt
        )
    return _parse_json_response(response.text)

"""
Batch Confusion Extraction
"""
async def batch_extract_confusions(notes_dict: dict):
    if not notes_dict:
        return {}
    notes_str = "\n".join([f'"{sid}": "{text}"' for sid, text in notes_dict.items()])
    prompt = f"""
        Extract confusion topics from these academic notes.
        Return ONLY valid JSON mapping the student ID to their confusion topics:
        {{
            "student_id_1": {{ "confusion_topics": [ {{ "topic": "short title", "description": "clear explanation" }} ] }},
            "student_id_2": {{ "confusion_topics": [ {{ "topic": "short title", "description": "clear explanation" }} ] }}
        }}
        
        Notes:
        {notes_str}
    """
    async with api_lock:
        await asyncio.sleep(8)
        response = gemini_client.models.generate_content(
            model=MODEL_ID, 
            contents=prompt
        )
    return _parse_json_response(response.text)

"""
Batch Embedding Generation
"""
async def batch_generate_embeddings(note_texts: list):
    if not note_texts:
        return []
    async with api_lock:
        await asyncio.sleep(8)
        response = gemini_client.models.embed_content(
            model="gemini-embedding-001",
            contents=note_texts,
            config={'task_type': 'clustering'}
        )
    if response.embeddings:
        return [e.values for e in response.embeddings]
    return []

# Simple in-memory cache to prevent spamming the Gemini API on page reloads/React StrictMode double-mounts
_heatmap_cache = {}

"""
HeatMap Data Generation
"""
async def generate_heatmap_data(class_name: str, date: str):
    try:
        students_cursor = db.students.find({
            f"classes.{class_name}.{date}": {"$exists": True}
        })
        students = await students_cursor.to_list(length=None)

        if not students:
            return []

        # Check cache based on student count
        cache_key = f"{class_name}_{date}"
        if cache_key in _heatmap_cache and _heatmap_cache[cache_key]["count"] == len(students):
            return _heatmap_cache[cache_key]["data"]

        # Prepare data for processing
        valid_students = []
        for student in students:
            student_id = str(student["_id"])
            name = student.get("name", "Unknown")
        
            if "classes" not in student or class_name not in student["classes"] or date not in student["classes"][class_name]:
                continue
            
            note_data = student["classes"][class_name][date]
            note_text = note_data.get("notes", "").strip()

            if note_text:
                valid_students.append({
                    "student_id": student_id,
                    "name": name,
                    "note_text": note_text
                })

        processed_students = []
    
        notes_dict = {s["student_id"]: s["note_text"] for s in valid_students}
        note_texts = [s["note_text"] for s in valid_students]
        
        # 1. Batch Embedding
        embeddings = await batch_generate_embeddings(note_texts)
    
        # 2. Batch Sentiment
        sentiments_result = await batch_classify_sentiments(notes_dict)
    
        # 3. Filter for confusion extraction
        confused_notes_dict = {}
        for sid, text in notes_dict.items():
            s_data = sentiments_result.get(sid, {})
            sentiment = s_data.get("sentiment", "UNKNOWN")
            if sentiment in ["CONFUSION", "UNANSWERED_QUESTION"]:
                confused_notes_dict[sid] = text
            
        confusions_result = await batch_extract_confusions(confused_notes_dict) if confused_notes_dict else {}
    
        # 4. Assemble processed data for this chunk
        for j, s in enumerate(valid_students):
            sid = s["student_id"]
            s_data = sentiments_result.get(sid, {})
            c_data = confusions_result.get(sid, {})
        
            processed_students.append({
                "student_id": sid,
                "name": s["name"],
                "sentiment": s_data.get("sentiment", "UNKNOWN"),
                "confidence": s_data.get("confidence", 0.0),
                "confusion_topics": c_data.get("confusion_topics", []),
                "embedding": embeddings[j] if j < len(embeddings) else []
            })
            
        if not processed_students:
            return []

        # Build embedding matrix
        embeddings_np = np.array([s["embedding"] for s in processed_students if s["embedding"] is not None and len(s["embedding"]) > 0])
    
        if len(embeddings_np) == 0:
            return []

        # Ensure 2D array
        if embeddings_np.ndim == 1:
            embeddings_np = embeddings_np.reshape(1, -1)

        # Run PCA in a separate thread to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        n_components = min(2, len(embeddings_np), len(embeddings_np[0])) if len(embeddings_np) > 0 else 2
    
        if n_components > 0:
             coords = await loop.run_in_executor(None, lambda: PCA(n_components=n_components).fit_transform(embeddings_np))
        else:
             coords = np.zeros((len(embeddings_np), 2))
         
        # If n_components was 1, pad coords to be 2D
        if coords.shape[1] == 1:
            coords = np.pad(coords, ((0, 0), (0, 1)), 'constant')

        # Run DBSCAN in executor as well
        labels = await loop.run_in_executor(None, lambda: DBSCAN(eps=0.5, min_samples=1).fit(coords).labels_)

        # Build heatmap data
        heatmap_data = []
    
        # We need to map only those students who had valid embeddings back to the original list
        valid_students_processed = [s for s in processed_students if s["embedding"] is not None and len(s["embedding"]) > 0]
    
        for i, student in enumerate(valid_students_processed):
            heatmap_data.append({
                "student_id": student["student_id"],
                "name": student["name"],
                "x": float(coords[i][0]),
                "y": float(coords[i][1]),
                "sentiment": student["sentiment"],
                "confidence": student["confidence"],
                "cluster": int(labels[i]),
                "confusion_topics": student["confusion_topics"]
            })
        # Save to cache
        _heatmap_cache[cache_key] = {
            "count": len(students),
            "data": heatmap_data
        }
        
        return heatmap_data

    except Exception as e:
        raise


def get_single_embedding(text: str):
    # This is kept for backwards compatibility if needed, but we recommend await generate_embedding
    embedding = genai.embed_content(
        model="gemini-embedding-001",
        content=text,
        task_type="clustering"
    )
    return embedding["embedding"]