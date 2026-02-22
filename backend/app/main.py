from fastapi import FastAPI
from services.logic import generate_heatmap_data

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/heatmap")
def heatmap():
    return generate_heatmap_data()
