import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Centralized async database connection using Motor
client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client["ClassroomSense"]
