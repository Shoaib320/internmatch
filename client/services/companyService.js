import api from "./api";

export async function getCompanyProfile(userId) {
  const response = await api.get(`/companies/profile/${userId}`);
  return response.data;
}

export async function createCompanyProfile(payload) {
  const response = await api.post("/companies/profile", payload);
  return response.data;
}

export async function updateCompanyProfile(userId, payload) {
  const response = await api.put(`/companies/profile/${userId}`, payload);
  return response.data;
}

export async function getCompanyDashboard(userId) {
  const response = await api.get(`/companies/dashboard/${userId}`);
  return response.data;
}
