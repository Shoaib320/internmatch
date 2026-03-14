import api from "./api";

export async function getResume(studentId) {
  const response = await api.get(`/resumes/${studentId}`);
  return response.data;
}

export async function createResume(payload) {
  const response = await api.post("/resumes", payload);
  return response.data;
}

export async function updateResume(studentId, payload) {
  const response = await api.put(`/resumes/${studentId}`, payload);
  return response.data;
}

