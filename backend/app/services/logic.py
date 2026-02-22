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
import traceback

load_dotenv()

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
import certifi
mongo_client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"), tlsCAFile=certifi.where())
db = mongo_client["ClassroomSense"]

MODEL_ID = "gemini-2.5-flash"

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
Sentiment Classification
"""
async def classify_sentiment(note_text: str):
    prompt = f"""
        You are an academic sentiment classifier.
        Classify this classroom note into: CONFUSION, UNDERSTOOD, UNANSWERED_QUESTION.
        Return ONLY valid JSON:
        {{ "sentiment": "...", "confidence": float }}
        Student note: {note_text}
    """

    async with api_lock:
        await asyncio.sleep(3)
        response = gemini_client.models.generate_content(
            model=MODEL_ID, 
            contents=prompt
        )
    return _parse_json_response(response.text)

"""
Confusion extraction
"""
async def extract_confusion(note_text: str):
    prompt = f"""
        Extract confusion topics from this academic note.
        Return ONLY JSON:
        {{ "confusion_topics": [ {{ "topic": "short title", "description": "clear explanation" }} ] }}
        Note: {note_text}
    """
    async with api_lock:
        await asyncio.sleep(3)
        response = gemini_client.models.generate_content(
            model=MODEL_ID, 
            contents=prompt
        )
    return _parse_json_response(response.text)

"""
Embedding Generation
"""
async def generate_embedding(note_text: str):
    async with api_lock:
        await asyncio.sleep(3)
        response = gemini_client.models.embed_content(
            model="gemini-embedding-001",
            contents=[note_text],
            config={'task_type': 'clustering'}
        )
    if response.embeddings:
        return response.embeddings[0].values
    return []

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

        async def process_student(student):
            student_id = str(student["_id"])
            name = student.get("name", "Unknown")
            
            try:
                # Handle cases where classes might not exist properly depending on schema changes
                if "classes" not in student or class_name not in student["classes"] or date not in student["classes"][class_name]:
                    return None
                    
                note_data = student["classes"][class_name][date]
                note_text = note_data.get("notes", "").strip()

                if not note_text:
                    return None

                # Async calls
                sentiment_task = asyncio.create_task(classify_sentiment(note_text))
                embedding_task = asyncio.create_task(generate_embedding(note_text))

                sentiment_data = await sentiment_task
                sentiment = sentiment_data.get("sentiment", "UNKNOWN")
                confidence = sentiment_data.get("confidence", 0.0)

                if sentiment in ["CONFUSION", "UNANSWERED_QUESTION"]:
                    confusion_task = asyncio.create_task(extract_confusion(note_text))
                    confusion_result = await confusion_task
                    confusion_topics = confusion_result.get("confusion_topics", [])
                else:
                    confusion_topics = []

                embedding = await embedding_task

                return {
                    "student_id": student_id,
                    "name": name,
                    "sentiment": sentiment,
                    "confidence": confidence,
                    "confusion_topics": confusion_topics,
                    "embedding": embedding
                }
            except Exception as e:
                traceback.print_exc()
                return None

        # Process all students concurrently
        tasks = [process_student(s) for s in students]
        processed_students_list = await asyncio.gather(*tasks)
        processed_students = [s for s in processed_students_list if s is not None]
        
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
        # We filtered processed_students above, so let's match the indices
        valid_students = [s for s in processed_students if s["embedding"] is not None and len(s["embedding"]) > 0]
        
        for i, student in enumerate(valid_students):
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

        return heatmap_data

    except Exception as e:
        traceback.print_exc()
        raise e


def get_single_embedding(text: str):
    # This is kept for backwards compatibility if needed, but we recommend await generate_embedding
    embedding = genai.embed_content(
        model="gemini-embedding-001",
        content=text,
        task_type="clustering"
    )
    return embedding["embedding"]