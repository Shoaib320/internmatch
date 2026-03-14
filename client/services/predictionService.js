import api from "./api";

export async function generatePredictions(payload = {}) {
  const response = await api.post("/predictions/recommend", payload);
  return response.data;
}

export async function getPredictionHistory(studentId) {
  const response = await api.get(`/predictions/${studentId}`);
  return response.data;
}
