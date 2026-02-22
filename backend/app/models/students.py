import os
import datetime
import io

import pymongo
from fastapi import APIRouter, UploadFile, File, Form
from docx import Document
from dotenv import load_dotenv

from services.logic import get_single_embedding 

load_dotenv()

router = APIRouter()

@router.post("/upload_note")
async def upload_student_note(
    student_name: str = Form(...),
    class_name: str = Form(...),
    topic: str = Form(...),
    file: UploadFile = File(...)
):

    content = await file.read()
    doc = Document(io.BytesIO(content))
    full_text = "\n".join([para.text for para in doc.paragraphs])
    
    # 2. Get the AI numbers from Gemini
    ai_numbers = get_single_embedding(full_text)
    
    
    client = pymongo.MongoClient(os.getenv("MONGO_URI"))
    db = client["ClassroomSense"]
    today = datetime.datetime.now().strftime("%Y-%m-%d")

    db.students.update_one(
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
