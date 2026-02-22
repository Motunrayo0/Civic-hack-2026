

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

export async function getTeacher(name: string) {
  const response = await fetch(`${API_BASE_URL}/teachers/${encodeURIComponent(name)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch teacher: ${response.statusText}`);
  }

  return response.json();
}

export async function getClassroomHeatmap(className: string, date: string) {
  const response = await fetch(`${API_BASE_URL}/heatmap?class_name=${encodeURIComponent(className)}&date=${encodeURIComponent(date)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch heatmap: ${response.statusText}`);
  }

  const rawData = await response.json();
  return rawData;
}
