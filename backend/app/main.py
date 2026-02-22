from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from models.students import upload_student_note
from models.teachers import router as teacher_router
from services.logic import generate_heatmap_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
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
