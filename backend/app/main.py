from fastapi import FastAPI
# Import the 'router' you just created in the students file
from models.students import router as student_router

app = FastAPI()

# This line connects the two files together
app.include_router(student_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}