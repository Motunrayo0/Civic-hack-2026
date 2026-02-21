import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

def get_notes_for_clustering(class_name):
    client = pymongo.MongoClient(os.getenv("MONGO_URI"))
    db = client["ClassroomSense"]
    collection = db["students"]
    
    # This 'query' looks inside the nested 'classes' folder we made
    # It finds everyone taking that specific class
    cursor = collection.find({f"classes.{class_name}": {"$exists": True}})
    
    all_notes = []
    for student in cursor:
        # We grab the notes for the most recent date
        class_data = student['classes'][class_name]
        for date in class_data:
            all_notes.append(class_data[date]['notes'])
            
    return all_notes

# TEST IT:
notes = get_notes_for_clustering("Shakespeare_ENG302")
print(f"Found {len(notes)} notes to analyze!")