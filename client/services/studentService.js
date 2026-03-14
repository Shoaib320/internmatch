import api from "./api";

export async function getStudentProfile(userId) {
  const response = await api.get(`/students/profile/${userId}`);
  return response.data;
}

export async function createStudentProfile(payload) {
  const response = await api.post("/students/profile", payload);
  return response.data;
}

export async function updateStudentProfile(userId, payload) {
  const response = await api.put(`/students/profile/${userId}`, payload);
  return response.data;
}

