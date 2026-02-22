from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.students import router as student_router
from models.teachers import router as teacher_router
from services.logic import generate_heatmap_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router)
app.include_router(teacher_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/heatmap")
async def heatmap(class_name: str, date: str):
    return await generate_heatmap_data(class_name, date)
