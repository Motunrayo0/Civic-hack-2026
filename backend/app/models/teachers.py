import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

def test_teacher_connection(name_to_find):
    client = pymongo.MongoClient(os.getenv("MONGO_URI"))
    db = client["ClassroomSense"]
    
    
    teacher = db.Teachers.find_one({"teacher_name": name_to_find})
    
    if teacher:
        print(f"Connected to teacher: {teacher['teacher_name']}")
        print(f"Teach these classes: {teacher['classes_taught']}")
        specific_class = teacher['classes_taught'][0]
        print(f"Looking at: {specific_class}")
    else:
        print("Teacher not found. Check the name in MongoDB!")

test_teacher_connection("Dr. Aris Thorne")