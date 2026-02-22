import datetime
import io
import asyncio
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
