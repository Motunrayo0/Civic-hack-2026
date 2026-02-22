import json

with open("backend/data/ClassroomSense.students.json", "r") as f:
    students = json.load(f)

# The new mapping
reflections = [
  ("Jordan Smith", "Event Horizon Mechanics", "I'm confused about the event horizon. If nothing escapes, then how does Hawking radiation work? Doesn't that violate the boundary?"),
  ("Aria V.", "Time Dilation", "I'm lost on time dilation near the black hole. Why does time stop for an outside observer but proceed normally for someone falling in?"),
  ("Blake S.", "Tidal Forces", "The concept of spaghettification makes total sense now! Because gravity follows an inverse-square law, the tidal forces stretch an object out."),
  ("Charlie D.", "The Singularity", "What exactly happens at the singularity? Do the laws of physics just stop acting entirely, or is there a unified theory we just haven't found?"),
  ("Dani L.", "General Relativity", "Understanding General Relativity really helped clarify how mass curves spacetime. The geometry of the universe is fascinating."),
  ("Emerson J.", "Information Paradox", "I'm confused about the information paradox. If black holes evaporate completely, where does all the quantum information of what fell in go?"),
  ("Finn K.", "Hawking Radiation", "Hawking radiation is brilliant. Virtual particle pairs forming at the horizon, one falls in, the other escapes, effectively draining mass. Wow."),
  ("Gale M.", "Event Horizon Mechanics", "Why can't light escape? I thought photons didn't have mass. How can gravity pull on something that is massless?"),
  ("Hollis R.", "Event Horizon Mechanics", "The escape velocity equation makes it perfectly clear. When the required velocity exceeds c, not even light can get out. Simple math, wild concept."),
  ("Indi P.", "Photon Sphere", "I want to know more about the photon sphere. If you stood there, could you literally see the back of your own head?"),
  ("Jordan T.", "The Singularity", "Is it possible for a wormhole to exist inside a rotating Kerr black hole? Could the ring singularity act as a bridge?"),
  ("Kai B.", "Supermassive Black Holes", "I read that supermassive black holes might actually be less dense than water. How does that volume-to-mass ratio even work?"),
  ("Lennon W.", "Event Horizon Mechanics", "If gravitational waves propagate at the speed of light, what happens to them extremely close to the event horizon?"),
  ("Jordan Smith", "General Relativity", "I'm really struggling to visualize the bending of spacetime in 3D. The rubber sheet analogy just isn't cutting it for me anymore."),
  ("Casey Rivera", "Event Horizon Mechanics", "Understanding the Schwarzschild radius helped pull everything together. It defines exactly where that point of no return is."),
  ("Sam Taylor", "Stellar Collapse", "Wait, so if a star collapses, does the gravity actually increase, or does it just get more concentrated? I don't follow.")
]

# We should match by name or by index since the order is exact
for i, student in enumerate(students):
    if "Shakespeare_ENG302" in student["classes"]:
        cls_data = student["classes"].pop("Shakespeare_ENG302")
        # Put under Astrophysics_AST301
        
        # We need to map the first 13 reflections 1-to-1 to the first 13 students
        if i < 13:
            topic = reflections[i][1]
            notes = reflections[i][2]
            
            for date in list(cls_data.keys()):
                cls_data[date]["topic"] = topic
                cls_data[date]["notes"] = notes

        # The last 3 students (Jordan Smith, Casey Rivera, Sam Taylor) have a second entry
        elif i == 13:
             # Jordan Smith 2nd note (r14)
             for date in list(cls_data.keys()):
                cls_data[date]["topic"] = reflections[13][1]
                cls_data[date]["notes"] = reflections[13][2]
        elif i == 14:
             # Casey (r15)
             for date in list(cls_data.keys()):
                cls_data[date]["topic"] = reflections[14][1]
                cls_data[date]["notes"] = reflections[14][2]
        elif i == 15:
             # Sam (r16)
             for date in list(cls_data.keys()):
                cls_data[date]["topic"] = reflections[15][1]
                cls_data[date]["notes"] = reflections[15][2]

        student["classes"]["Astrophysics_AST301"] = cls_data

with open("backend/data/ClassroomSense.students.json", "w") as f:
    json.dump(students, f, indent=2)

print("Updated students.json")

