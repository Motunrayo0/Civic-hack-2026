# Feature PRD: Connecting Frontend and Backend

## Problem Statement
Currently, the "ClassroomSense" (EduPulse & Classroom Pulse) application relies on static, hardcoded placeholder data in `mockData.ts` for all its visual representations and metrics. The backend logic (FastAPI, MongoDB, Gemini AI) is fully functional for uploading `.docx` notes, generating embeddings, and running DBSCAN clustering to form topic clusters. However, these systems do not talk to each other. We need to establish a bidirectional data lifecycle where students can upload notes via the front end, and teachers can view real-time clustered insights returned directly from the backend API.

## Proposed Solution
We will connect the application layers by replacing the `mockData.ts` dependency with real API fetching mechanisms.
1. **Frontend API Layer:** An `api.ts` file handling all native `fetch` requests with proper type definitions based on backend schemas.
2. **Student Submission:** Add a file upload UI within the `EduPulse` student view component to allow students to submit `.docx` files triggering `POST /upload_note`.
3. **Teacher Visualization:** Modify `ClassroomPulse.tsx` and its child components to map the backend `GET /heatmap` array (`{ student_id, name, x, y, sentiment, confidence, cluster, confusion_topics }`) into the coordinate format necessary for the 2D canvas and D3 clusters.
4. **CORS:** Ensure the FastAPI application allows access from the Vite React frontend.

## Success Criteria
1. **E2E Post Note:** A student can click an upload button on the EduPulse page, select a `.docx` file, and see a success response representing that the document has been successfully parsed, embedded, and saved to MongoDB.
2. **E2E View Insights:** A teacher can open the Classroom Pulse page and retrieve an array of student nodes mapped strictly from the MongoDB backend data, accurately representing actual submitted documents.
3. No console errors indicating CORS mismatches. No 500 errors during JSON parsing.

## Technical Approach
- **HTTP Client**: Use browser native `fetch` over Axios to minimize bundles and configuration.
- **Environment**: Define `VITE_API_BASE_URL` in a `.env` file for the frontend to easily pivot between local and production backend domains. 
- **Data Transformation**: The backend returns individual student nodes mapped to clusters (`0, 1, 2, ...`). The frontend UI (`LivePulseCanvas`) currently maps `TopicCluster` aggregates (with `x`, `y`, `size`). We will introduce a lightweight converter function in `api.ts` or `ClassroomPulse.tsx` that calculates the center point `(x, y)` of each cluster from its constituent student nodes to generate the large aggregate bubbles the UI expects.

## UX Considerations
- **Upload States**: The user must receive visual feedback during the file upload (Uploading..., Success, Error) since text embedding algorithms take a few seconds to run.
- **Empty States**: If `GET /heatmap` returns an empty array (no student notes for today), the UI should gently fallback to an "Awaiting Student Reflections..." message rather than aggressively throwing an error or rendering an empty void.

## Edge Cases
- **Missing API URL**: The frontend should gracefully warn developers if the `.env` variable for the API base url is missing.
- **File Types**: The backend explicitly looks for `.docx` structures. The frontend file input should rigidly specify `accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"`.
- **Backend Unreachable**: Fetch failure alerts via standard browser APIs (`toast` or inline errors) in case the FastAPI server drops.

---
**PRD Status:** ✅ APPROVED (Self-Reviewed)
**Date:** 2026-02-21
