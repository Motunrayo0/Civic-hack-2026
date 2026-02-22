import os
import datetime
import io
import asyncio

from fastapi import APIRouter, UploadFile, File, Form
from docx import Document
from dotenv import load_dotenv
# This reaches into your logic.py file
from services.logic import generate_embedding
from services.db import db

load_dotenv()

router = APIRouter()

def parse_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n".join([para.text for para in doc.paragraphs])


@router.post("/upload_note")
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
