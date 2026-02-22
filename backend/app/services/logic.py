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
import logging
import traceback
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
Batch Sentiment Classification
"""
@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(5)
)
async def batch_classify_sentiments(notes_dict: dict):
    if not notes_dict:
        return {}
    notes_str = "\n".join([f'"{sid}": "{text}"' for sid, text in notes_dict.items()])
    prompt = f"""
        You are an academic sentiment classifier.
        Classify the following classroom notes into: CONFUSION, CURIOSITY, CLARITY.
        Return ONLY valid JSON mapping the student ID to their classification. Do not include markdown formatting.
        {{
            "student_id_1": {{ "sentiment": "...", "confidence": float }},
            "student_id_2": {{ "sentiment": "...", "confidence": float }}
        }}
        
        Notes:
        {notes_str}
    """

    async with api_lock:
        response = gemini_client.models.generate_content(
            model=MODEL_ID, 
            contents=prompt,
            config=genai.types.GenerateContentConfig(response_mime_type="application/json")
        )
    return _parse_json_response(response.text)

"""
Batch Confusion Extraction
"""
@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(5)
)
async def batch_extract_confusions(notes_dict: dict):
    if not notes_dict:
        return {}
    notes_str = "\n".join([f'"{sid}": "{text}"' for sid, text in notes_dict.items()])
    prompt = f"""
        Extract confusion topics from these academic notes.
        Return ONLY valid JSON mapping the student ID to their confusion topics. Do not include markdown formatting.
        {{
            "student_id_1": {{ "confusion_topics": [ {{ "topic": "short title", "description": "clear explanation" }} ] }},
            "student_id_2": {{ "confusion_topics": [ {{ "topic": "short title", "description": "clear explanation" }} ] }}
        }}
        
        Notes:
        {notes_str}
    """
    async with api_lock:
        response = gemini_client.models.generate_content(
            model=MODEL_ID, 
            contents=prompt,
            config=genai.types.GenerateContentConfig(response_mime_type="application/json")
        )
    return _parse_json_response(response.text)

"""
Batch Embedding Generation
"""
@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(5)
)
async def batch_generate_embeddings(note_texts: list):
    if not note_texts:
        return []
    async with api_lock:
        response = gemini_client.models.embed_content(
            model="gemini-embedding-001",
            contents=note_texts,
            config={'task_type': 'clustering'}
        )
    if response.embeddings:
        return [e.values for e in response.embeddings]
    return []

# Cache for single-student heatmap route to avoid duplicate API calls
_student_reflections_cache = {}

@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(5)
)
async def analyze_single_student_reflections(student_id: str, class_name: str):
    logger.info(f"[DEBUG] analyze_single_student_reflections - start: student_id={student_id}, class_name={class_name}")
    try:
        # Check cache
        cache_key = f"{student_id}_{class_name}"
        if cache_key in _student_reflections_cache:
            logger.info(f"[DEBUG] Returning cached student reflections for {cache_key}")
            return _student_reflections_cache[cache_key]

        student = await db.students.find_one({"_id": ObjectId(student_id)})
        if not student or "classes" not in student or class_name not in student["classes"]:
            return {}

        class_data = student["classes"][class_name]
        
        # Build prompt map: date -> note_text
        notes_to_analyze = {}
        for date, note_data in class_data.items():
            text = note_data.get("notes", "").strip()
            if text:
                notes_to_analyze[date] = text

        if not notes_to_analyze:
            return {}

        notes_str = "\n".join([f'"{date}": "{text}"' for date, text in notes_to_analyze.items()])
        
        prompt = f"""
            You are an academic sentiment classifier analyzing a single student's notes over time.
            Classify the following classroom notes into: CONFUSION, CURIOSITY, CLARITY.
            Return ONLY valid JSON mapping the date to their classification:
            {{
                "YYYY-MM-DD": {{ "sentiment": "...", "confidence": float }},
                "YYYY-MM-DD": {{ "sentiment": "...", "confidence": float }}
            }}
            
            Notes:
            {notes_str}
        """

        logger.info(f"[DEBUG] Requesting lightweight sentiment classification for student {student_id}")
        
        async with api_lock:
            response = gemini_client.models.generate_content(
                model=MODEL_ID, 
                contents=prompt,
                config=genai.types.GenerateContentConfig(response_mime_type="application/json")
            )
            
        result = _parse_json_response(response.text)
        
        # Save to cache
        _student_reflections_cache[cache_key] = result
        return result

    except Exception as e:
        logger.error(f"[DEBUG] analyze_single_student_reflections failed: {e}")
        traceback.print_exc()
        raise

# Simple in-memory cache to prevent spamming the Gemini API on page reloads/React StrictMode double-mounts
_heatmap_cache = {}
# Per-key locks so concurrent requests for the same heatmap wait instead of making duplicate Gemini calls
_heatmap_locks: dict[str, asyncio.Lock] = {}

def invalidate_heatmap_cache():
    """Clear all cached heatmap data (e.g. when a student toggles anonymity)."""
    _heatmap_cache.clear()

"""
HeatMap Data Generation
"""
async def generate_heatmap_data(class_name: str, date: str):
    cache_key = f"{class_name}_{date}"

    # Get or create a per-key lock so only one request runs the Gemini pipeline at a time
    if cache_key not in _heatmap_locks:
        _heatmap_locks[cache_key] = asyncio.Lock()

    async with _heatmap_locks[cache_key]:
        logger.info(f"[DEBUG] generate_heatmap_data - start: class_name={class_name}, date={date}")
        # Check cache first (inside lock so the second caller sees the result from the first)
        if cache_key in _heatmap_cache:
            logger.info(f"[DEBUG] Returning cached heatmap data for {cache_key}")
            return _heatmap_cache[cache_key]["data"]

        try:
            students_cursor = db.students.find({
                f"classes.{class_name}.{date}": {"$exists": True}
            })
            students = await students_cursor.to_list(length=None)

            if not students:
                return []

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
                        "is_anonymous": student.get("is_anonymous", False),
                        "note_text": note_text
                    })

            processed_students = []

            logger.info(f"[DEBUG] Processing all {len(valid_students)} students in a single batch")

            notes_dict = {s["student_id"]: s["note_text"] for s in valid_students}
            note_texts = [s["note_text"] for s in valid_students]

            # 1 & 2. Batch Embedding AND Sentiment Analysis (Parallel)
            logger.info("[DEBUG] Requesting batch embeddings and sentiments concurrently")
            try:
                embeddings, sentiments_result = await asyncio.gather(
                    batch_generate_embeddings(note_texts),
                    batch_classify_sentiments(notes_dict)
                )
            except Exception as e:
                logger.error(f"[DEBUG] Batch embedding/sentiment error: {e}")
                raise

            # 3. Filter for confusion extraction
            confused_notes_dict = {}
            for sid, text in notes_dict.items():
                s_data = sentiments_result.get(sid, {})
                sentiment = s_data.get("sentiment", "UNKNOWN").upper()
                if sentiment in ["CONFUSION"]:
                    confused_notes_dict[sid] = text

            logger.info(f"[DEBUG] Requesting batch confusions for {len(confused_notes_dict)} notes")
            try:
                confusions_result = await batch_extract_confusions(confused_notes_dict) if confused_notes_dict else {}
            except Exception as e:
                logger.error(f"[DEBUG] Batch confusion error: {e}")
                raise

            # 4. Assemble processed data for this chunk
            for j, s in enumerate(valid_students):
                sid = s["student_id"]
                s_data = sentiments_result.get(sid, {})
                c_data = confusions_result.get(sid, {})

                processed_students.append({
                    "student_id": sid,
                    "name": "Anonymous Student" if s.get("is_anonymous") else s["name"],
                    "is_anonymous": s.get("is_anonymous", False),
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
                    "name": "Anonymous Student" if student.get("is_anonymous") else student["name"],
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

            logger.info(f"[DEBUG] generate_heatmap_data - success, returning {len(heatmap_data)}")
            return heatmap_data

        except Exception as e:
            logger.error(f"[DEBUG] generate_heatmap_data failed: {e}")
            traceback.print_exc()
            raise


"""
Cluster Summary Generation
"""
@retry(
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(5)
)
async def generate_cluster_summary(notes: list[str], pattern: str) -> str:
    """
    Generates a concise AI synthesis of what a cluster of students is thinking.
    Used in the ClusterOverlay when a teacher clicks a pulse on the heatmap.
    """
    if not notes:
        return "No student notes available for this cluster."

    notes_block = "\n".join([f"- {note}" for note in notes])
    prompt = f"""
        You are an education insights assistant helping a teacher understand student thinking.
        The following student notes all belong to a cluster of students whose dominant thinking pattern is: {pattern.upper()}.

        Student notes:
        {notes_block}

        Write exactly two short sentences synthesizing what these students are thinking or struggling with.
        It should be easy for a teacher to read mid-class, but detailed enough to identify the specific nuance or tension.
        Address the teacher directly (e.g., "Students are wondering about..."). No bullet points.
    """

    try:
        async with api_lock:
            response = gemini_client.models.generate_content(
                model=MODEL_ID,
                contents=prompt
            )
        return response.text.strip() if response.text else "Could not generate summary."
    except Exception as e:
        logger.error({"error": str(e)}, "Cluster summary generation failed")
        return "Summary unavailable — AI service encountered an error."