import os
from google import genai
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import DBSCAN
import json

load_dotenv()

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["civic_hack"]

MODEL_ID = "gemini-1.5-flash"

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

    response = gemini_client.models.generate_content(
        model=MODEL_ID, 
        contents=prompt
    )
    return json.loads(response.text)

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
    response = gemini_client.models.generate_content(
        model=MODEL_ID, 
        contents=prompt
    )
    return json.loads(response.text)

"""
Embedding Generation
"""
async def generate_embedding(note_text: str):
    response = gemini_client.models.embed_content(
        model="text-embedding-004",
        contents=note_text
    )
    return response.embeddings[0].values

"""
HeatMap Data Generation
"""
async def generate_heatmap_data(class_name: str, date: str):
    students_cursor = db.students.find({
        f"classes.{class_name}.{date}": {"$exists": True}
    })

    students = await students_cursor.to_list(length=None)

    embeddings = []
    processed_students = []

    for student in students:
        student_id = str(student["_id"])
        name = student["name"]

        note_data = student["classes"][class_name][date]
        note_text = note_data["notes"]

        # Sentiment
        sentiment_data = await classify_sentiment(note_text)
        sentiment = sentiment_data["sentiment"]
        confidence = sentiment_data["confidence"]

        # Confusion topics
        confusion_topics = []
        if sentiment in ["CONFUSION", "UNANSWERED_QUESTION"]:
            confusion = await extract_confusion(note_text)
            confusion_topics = confusion.get("confusion_topics", [])

        # Embedding
        embedding = await generate_embedding(note_text)

        embeddings.append(embedding)

        processed_students.append({
            "student_id": student_id,
            "name": name,
            "sentiment": sentiment,
            "confidence": confidence,
            "confusion_topics": confusion_topics,
            "embedding": embedding
        })

    # Convert to numpy
    embeddings_np = np.array(embeddings)

    # Reduce to 2D
    pca = PCA(n_components=2)
    coords = pca.fit_transform(embeddings_np)

    # Cluster
    clustering = DBSCAN(eps=0.5, min_samples=1).fit(coords)
    labels = clustering.labels_

    # Build response
    heatmap_data = []

    for i, student in enumerate(processed_students):
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


def get_single_embedding(text: str):
    # This is kept for backwards compatibility if needed, but we recommend await generate_embedding
    embedding = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="clustering"
    )
    return embedding["embedding"]