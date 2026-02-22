import os
import json
import asyncio
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client["ClassroomSense"]

async def seed_students_from_json():
    BASE_DIR = Path(__file__).resolve().parents[2]
    json_path = BASE_DIR / "data" / "ClassroomSense.students.json"
    # Load the JSON file
    with open(json_path, "r", encoding="utf-8") as f:
        students_data = json.load(f)

    # Convert any string $oid to ObjectId if needed
    for student in students_data:
        if "_id" in student and "$oid" in student["_id"]:
            student["_id"] = ObjectId(student["_id"]["$oid"])
        else:
            student["_id"] = ObjectId()  # generate new ID if none

    # Optional: clear existing students
    await db.students.delete_many({})

    # Insert students
    result = await db.students.insert_many(students_data)
    print(f"Inserted {len(result.inserted_ids)} students into the database.")


async def seed_teachers_from_json():
    BASE_DIR = Path(__file__).resolve().parents[2]
    json_path = BASE_DIR / "data" / "ClassroomSense.Teachers.json"

    # Load JSON
    with open(json_path, "r", encoding="utf-8") as f:
        teachers_data = json.load(f)

    # Convert string _id to ObjectId
    for teacher in teachers_data:
        if "_id" in teacher and "$oid" in teacher["_id"]:
            teacher["_id"] = ObjectId(teacher["_id"]["$oid"])
        else:
            teacher["_id"] = ObjectId()  # generate new ID if none

    # Optional: clear existing teachers
    await db.teachers.delete_many({})

    # Insert teachers
    result = await db.teachers.insert_many(teachers_data)

    print(f"Inserted {len(result.inserted_ids)} teachers.")

async def main():
    await seed_students_from_json()
    await seed_teachers_from_json()

if __name__ == "__main__":
    asyncio.run(main())