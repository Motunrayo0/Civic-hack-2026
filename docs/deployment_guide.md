# NotePal: Deployment Guide

Deploying this application requires hosting a **Frontend** (React + Vite) and a **Backend** (Python + FastAPI). The easiest approach for a modern stack like this is to use **Vercel** for the frontend and **Render** (or Vercel Serverless Functions) for the backend.

Below is a step-by-step guide on how to get your project live.

---

## 1. Prerequisites and Environment Variables
Before deploying, ensure you have the following secrets configured. You'll need to plug these into your hosting provider's dashboard.

### Backend (`/backend/.env`)
* `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/test`).
* `GEMINI_API_KEY`: Your API key for Google's Generative AI.

### Frontend (`/frontend/.env`)
* `VITE_API_BASE_URL`: The deployed URL of your backend once it's live (e.g., `https://notepal-backend.onrender.com`).

> **Important:** Never commit `.env` files to your Git repository. Provide these variables via your hosting platform's Secrets UI.

---

## 2. Deploying the Backend (Render)

[Render](https://render.com) is excellent for deploying Python APIs. It handles the `requirements.txt` execution effortlessly.

1. **Sign up/Log in** to Render and connect your GitHub account.
2. Click **New +** and select **Web Service**.
3. Select this repository.
4. Fill in the build details:
   * **Name**: `notepal-backend` (or similar)
   * **Root Directory**: `backend`
   * **Environment**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. Scroll down to **Advanced** and add your Environment Variables:
   * `MONGO_URI`
   * `GEMINI_API_KEY`
6. Click **Create Web Service**. Render will install your dependencies and launch FastAPI.
7. **Copy your backend URL** (e.g., `https://notepal-backend.onrender.com`). You will need this for the frontend!

---

## 3. Deploying the Frontend (Vercel)

[Vercel](https://vercel.com) provides seamless, lightning-fast hosting for Vite + React applications.

1. **Sign up/Log in** to Vercel and connect your GitHub account.
2. Click **Add New** > **Project** and import this repository.
3. In the project configuration:
   * **Framework Preset**: Vite
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Expand **Environment Variables**:
   * Add `VITE_API_BASE_URL` and set the value to to your newly deployed backend URL (e.g., `https://notepal-backend.onrender.com`).
5. Click **Deploy**. Vercel will compile the TypeScript definitions and bundle the application.

---

## 4. Post-Deployment Connections (CORS)

If your frontend is throwing "CORS" errors when trying to talk to your backend, you must update the permitted origins in FastAPI.

Open `/backend/app/main.py`. Find the `CORSMiddleware` configuration and add your final Vercel frontend link:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-vercel-app-url.vercel.app"  # <- ADD YOUR PRODUCTION URL HERE
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit this change, push it to your `main` branch, and Render will automatically redeploy the backend with the new permissions.

## 5. Congratulations
Your app is live! Students can now submit reflections from anywhere in the world, and teachers can use the `ClassroomPulse.tsx` dashboard to view AI-classified sentiment clusters matching the Astrophysics datasets.
