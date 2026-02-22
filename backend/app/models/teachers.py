from fastapi import APIRouter
from services.db import db

router = APIRouter()

@router.get("/teachers/{name_to_find}")
async def test_teacher_connection(name_to_find: str):
    teacher = await db.Teachers.find_one({"teacher_name": name_to_find})
    
    if teacher:
        return {
            "status": "success",
            "teacher_name": teacher['teacher_name'],
            "classes_taught": teacher.get('classes_taught', [])
        }
    else:
        return {"status": "error", "message": "Teacher not found. Check the name in MongoDB!"}