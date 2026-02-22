from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from models.students import upload_student_note, get_students, delete_student_note

# ... other imports ...

# from models.teachers import
# from models.teachers import 
from services.logic import generate_heatmap_data, analyze_single_student_reflections

app = FastAPI()

app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://civic-hack-2026.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/heatmap")
async def heatmap(class_name: str, date: str):
    return await generate_heatmap_data(class_name, date)

@app.post("/upload_note")
async def upload_note(
    student_name: str = Form(...),
    class_name: str = Form(...),
    topic: str = Form(...),
    file: UploadFile = File(...)
):
    return await upload_student_note(student_name, class_name, topic, file)

@app.get("/students")
async def students():
    return await get_students()

@app.delete("/students/{student_id}/classes/{class_name}/notes/{date}")
async def delete_note(student_id: str, class_name: str, date: str):
    return await delete_student_note(student_id, class_name, date)


@app.get("/students/{student_id}/classes/{class_name}/reflections/analyze")
async def analyze_student(student_id: str, class_name: str):
    return await analyze_single_student_reflections(student_id, class_name)
    
