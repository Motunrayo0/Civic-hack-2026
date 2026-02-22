

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// --- MongoDB Types ---
export interface MongoNoteData {
  topic: string;
  notes: string;
}

export interface MongoClassData {
  [date: string]: MongoNoteData;
}

export interface MongoStudent {
  _id: string; // The backend converts ObjectId to string
  name: string;
  classes?: {
    [className: string]: MongoClassData;
  };
}
// --------------------

/**
 * Fetches all student documents directly from the ClassroomSense MongoDB collection
 * via the backend /students endpoint.
 *
 * @returns {Promise<MongoStudent[]>} Array of raw student documents mapping to the DB schema
 */
export async function getStudents(): Promise<MongoStudent[]> {
  const response = await fetch(`${API_BASE_URL}/students`);
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.statusText}`);
  }
  return response.json();
}


/**
 * Uploads a student note file (e.g., .docx) to the backend for AI processing and embedding.
 *
 * @param studentName - The name of the student uploading the note
 * @param className - The course identifier (e.g., 'Shakespeare_ENG302')
 * @param topic - The specific topic of the note
 * @param file - The file object to upload
 * @returns Status of the upload
 */
export async function uploadStudentNote(
  studentName: string,
  className: string,
  topic: string,
  file: File
): Promise<{ status: string; message: string }> {
  const formData = new FormData();
  formData.append('student_name', studentName);
  formData.append('class_name', className);
  formData.append('topic', topic);
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload_note`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches teacher information and the list of classes they teach.
 *
 * @param name - The teacher's name to search for
 * @returns Teacher entity details
 */
export async function getTeacher(name: string) {
  const response = await fetch(`${API_BASE_URL}/teachers/${encodeURIComponent(name)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch teacher: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches the clustered heatmap data containing student AI embeddings evaluated
 * for sentiment and mapped to 2D coordinates.
 *
 * @param className - The course identifier
 * @param date - The target date for the lecture/class
 * @returns Array of nodes to be graphed on the pulse canvas
 */
export async function getClassroomHeatmap(className: string, date: string) {
  const response = await fetch(`${API_BASE_URL}/heatmap?class_name=${encodeURIComponent(className)}&date=${encodeURIComponent(date)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch heatmap: ${response.statusText}`);
  }

  const rawData = await response.json();
  return rawData;
}

/**
 * Deletes a student's note from the backend.
 *
 * @param studentId - The ID of the student
 * @param className - The course identifier
 * @param date - The date of the note to delete
 * @returns Status of the deletion
 */
export async function deleteNote(studentId: string, className: string, date: string): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/students/${encodeURIComponent(studentId)}/classes/${encodeURIComponent(className)}/notes/${encodeURIComponent(date)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete note: ${response.statusText}`);
  }

  return response.json();
}
