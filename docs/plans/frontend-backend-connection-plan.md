# Plan: Frontend & Backend Connection

## Goal Description
The objective is to connect the React frontend (running on Vite) to the FastAPI backend, replacing the hardcoded `mockData.ts` with real, dynamic data operations. This involves creating a centralized API service in the frontend, configuring CORS on the backend, and updating the UI components to execute data fetching and file uploads.

## User Review Required
> [!IMPORTANT]
> - **Note Uploading UI**: Currently, the frontend lacks a UI component for uploading `.docx` files (which the backend `POST /upload_note` requires). We will need to build an upload button or modal in `EduPulse.tsx` (or an adjacent component).
> - **Data Structures**: The backend `/heatmap` returns raw clustering data (x, y, sentiment, topics), whereas the frontend expects pre-aggregated `TopicCluster` definitions. Our plan handles this via a data transformation layer in the frontend to keep the current UI intact.

## Proposed Changes

### Backend APIs
- **[MODIFY] [main.py](file:///Users/richardtrinh/Development/projects/web/Civic-hack-2026/backend/app/main.py)**
  - Add `CORSMiddleware` from `fastapi.middleware.cors` to allow requests from the React frontend (e.g., `http://localhost:5173`).

### Frontend APIs & Services
- **[NEW] [api.ts](file:///Users/richardtrinh/Development/projects/web/Civic-hack-2026/frontend/src/services/api.ts)**
  - Implement native `fetch` wrappers for:
    - `uploadStudentNote(file: File, studentName, className, topic)`
    - `getClassroomHeatmap(className, date)`
    - `getTeacher(name)`
- **[NEW] [.env](file:///Users/richardtrinh/Development/projects/web/Civic-hack-2026/frontend/.env)**
  - Set `VITE_API_BASE_URL=http://localhost:8000`.

### Frontend Components
- **[MODIFY] [EduPulse.tsx](file:///Users/richardtrinh/Development/projects/web/Civic-hack-2026/frontend/src/pages/EduPulse.tsx)**
  - Add file upload UI for students to upload their `.docx` notes.
  - Wire up `uploadStudentNote` API call on submit.
- **[MODIFY] [ClassroomPulse.tsx](file:///Users/richardtrinh/Development/projects/web/Civic-hack-2026/frontend/src/pages/ClassroomPulse.tsx)**
  - Remove imports from `mockData.ts`.
  - Add `useEffect` to fetch real data from `getClassroomHeatmap()` and `getTeacher()`.
  - Implement a transformer function to map backend cluster data into `TopicCluster[]` formats expected by the D3/Canvas visuals.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npm run build` in the frontend to verify build passes.
- Run `pre-commit run --all-files` in the backend.

### Manual Verification
1. Start FastAPI backend (`cd backend/app && fastapi dev main.py`).
2. Start Frontend (`cd frontend && npm run dev`).
3. **Student Flow**: Go to `/` or EduPulse, try uploading a test `.docx` note. Check terminal to verify Gemini AI and MongoDB process the text successfully.
4. **Teacher Flow**: Go to Classroom Pulse, load the heatmap data for the class, and verify the frontend visually renders the clusters from the backend coordinates.
