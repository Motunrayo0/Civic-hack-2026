import datetime
import io
import asyncio
import os
from fastapi import UploadFile, File, Form
from docx import Document
from dotenv import load_dotenv
# This reaches into your logic.py file
from services.logic import generate_embedding
from services.db import db

load_dotenv()

def parse_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n".join([para.text for para in doc.paragraphs])


async def upload_student_note(
    student_name: str = Form(...),
    class_name: str = Form(...),
    topic: str = Form(...),
    file: UploadFile = File(...)
):

    content = await file.read()
    # Run docx parsing in thread to avoid blocking the event loop
    full_text = await asyncio.to_thread(parse_docx, content)
    
    # 2. Get the AI numbers from Gemini
    ai_numbers = await generate_embedding(full_text)
    print("Got to this point")
    today = datetime.datetime.now().strftime("%Y-%m-%d")

    await db.students.update_one(
        {"name": student_name},
        {
            "$set": {
                f"classes.{class_name}.{today}": {
                    "topic": topic,
                    "notes": full_text,     
                    "embedding": ai_numbers 
                }
            }
        },
        upsert=True
    )
    return {"status": "success", "message": f"Doc uploaded for {student_name}."}

async def get_students():
    # Use the ClassroomSense database as requested
    from motor.motor_asyncio import AsyncIOMotorClient
    import certifi
    client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"), tlsCAFile=certifi.where())
    classroom_sense_db = client["ClassroomSense"]
    
    # Exclude embeddings from being returned directly to frontend mapping
    students_cursor = classroom_sense_db.students.find({}, { "embedding": 0 })
    students = await students_cursor.to_list(length=None)
    
    # Convert MongoDB ObjectIds to strings
    for student in students:
        student["_id"] = str(student["_id"])
        
    return students

async def delete_student_note(student_id: str, class_name: str, date: str):
    from motor.motor_asyncio import AsyncIOMotorClient
    import certifi
    from bson.objectid import ObjectId
    
    client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"), tlsCAFile=certifi.where())
    classroom_sense_db = client["ClassroomSense"]
    
    try:
        obj_id = ObjectId(student_id)
    except Exception:
        return {"status": "error", "message": "Invalid student ID."}
        
    result = await classroom_sense_db.students.update_one(
        {"_id": obj_id},
        {"$unset": {f"classes.{class_name}.{date}": ""}}
    )
    
    if result.modified_count > 0:
        return {"status": "success", "message": "Note deleted successfully."}
    else:
        return {"status": "success", "message": "Note not found."}
