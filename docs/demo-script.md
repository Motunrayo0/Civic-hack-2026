# Noesis — Demo Script & User Flow

> **Estimated runtime:** 3–4 minutes  
> **Tagline:** *Making student thinking visible.*

---

## Pre-Demo Checklist

- [ ] Backend running: `cd backend && source .venv/bin/activate && fastapi dev app/main.py`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] At least one `.docx` note file ready for upload
- [ ] Browser at `http://localhost:5173` (or deployed URL)
- [ ] Screen recording tool ready

---

## Act 1 — The Hook (Landing Page)

**Route:** `/`

> **What the audience sees:** A clean, minimal landing page with animated floating bubbles (confusion, curiosity, clarity) and two CTA buttons.

### Script

> *"Every classroom has an invisible layer — the thoughts students don't say out loud. Noesis makes that layer visible."*
>
> *"Students and teachers get entirely different views of the same data. Let me show you both."*

### Actions
1. Let the bubble animation play for ~3 seconds
2. Click **"I'm a Student"**

---

## Act 2 — The Student Experience (EduPulse)

**Route:** `/student`

> **What the audience sees:** A student dashboard showing their profile, course cards, AI-synthesized class themes, their latest note, and a file upload zone.

### Script

> *"This is Mia's view. She's in Life Science 201. Right away she can see what her class is collectively exploring — themes around what defines life, whether stars are alive, and the role of energy."*

### Beat 1 — AI Synthesis Card
- **Point to** the AI Synthesis section
> *"This synthesis is generated from every student's notes in the class, not just Mia's. It surfaces the key tensions and themes the class is grappling with."*

### Beat 2 — Latest Note
- **Point to** "Your latest note"
> *"Mia can see her own contribution and how it was classified — confusion, curiosity, or clarity."*

### Beat 3 — File Upload (Live Demo)
- **Click** the upload zone, select a `.docx` file
- **Click** "Submit for AI Analysis"
- Wait for the success state

> *"Submitting notes is frictionless — drag in a Word doc, and the AI extracts the text, determines the student's thinking pattern, and merges it into the classroom's collective data in real-time."*

### Actions
1. Highlight the AI Synthesis card
2. Show the latest note + pattern badge
3. Upload a `.docx` → show the success confirmation
4. Click the **← Noesis** back button to return to Landing

---

## Act 3 — The Teacher Experience (Classroom Pulse)

**Route:** `/teacher`

> **What the audience sees:** A live heatmap canvas with colored orbs, a scrollable reflection feed, and an analytics sidebar.

### Script

> *"Now let's flip to the teacher's perspective. This is where the magic happens."*

### Beat 1 — Live Pulse Canvas (Heatmap)
- **Point to** the canvas with colored orbs

> *"Each bubble represents a cluster of students grouped by what they're thinking about and how they're thinking about it. Red is confusion, gold is curiosity, green is clarity."*
>
> *"The size of each orb reflects how many students are in that cluster. Teachers can see, at a glance, where the class's attention and struggle are concentrated."*

### Beat 2 — Cluster Drill-Down
- **Click** on one of the orbs (e.g., a red "confusion" cluster)
- The **Cluster Overlay** slides in showing individual students

> *"Clicking a cluster reveals which students are in it and what they wrote. This gives teachers a targeted view — they can decide in real-time whether to pause and re-explain, or move on."*

### Beat 3 — Live Reflection Feed
- **Scroll** through the feed cards below the canvas

> *"Below the canvas is the raw feed of student reflections, each tagged with a thinking pattern. Teachers can scan these to get the full picture."*

### Beat 4 — Student Journey Modal
- **Click** a student name in the feed or cluster overlay
- The **Student Journey Modal** opens

> *"Clicking on any student opens their journey — every note they've submitted, how their thinking has evolved over time. This is longitudinal insight, not just a snapshot."*

### Beat 5 — Analytics Sidebar
- **Point to** the sidebar on the right

> *"The sidebar gives aggregate stats — what percentage of the class is confused vs. curious vs. clear, and which topics are generating the most engagement."*

---

## Act 4 — The Close

- **Navigate back** to the Landing page

### Script

> *"Noesis bridges the gap between what students think and what teachers see. Notes go in, AI-powered insights come out — for both sides of the classroom."*
>
> *"It's built with React, FastAPI, MongoDB, and the Gemini API. Every note is embedded, clustered, and sentiment-analyzed in real-time."*

---

## Technical Talking Points (if asked)

| Layer | Tech | Purpose |
|-------|------|---------|
| Frontend | React + Vite + Framer Motion | Responsive UI with animated visualizations |
| Backend | FastAPI (Python) | REST API for student data, file upload, AI analysis |
| Database | MongoDB Atlas | Stores student profiles, notes, and class structure |
| AI | Google Gemini API | Sentiment analysis, note extraction, clustering & embeddings |
| Deployment | Vercel (frontend) + Render (backend) | Production hosting |

---

## Key Moments to Emphasize

1. **The upload → analysis loop** — show that a new note immediately affects the teacher's view
2. **Cluster visualization** — the heatmap is the centerpiece, it's what makes Noesis unique
3. **Both perspectives** — the student/teacher duality is the core insight
4. **No busywork** — students just upload notes they're already writing; teachers get insights without grading
