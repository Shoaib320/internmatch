import api from "./api";

export async function getInternships() {
  const response = await api.get("/internships");
  return response.data;
}

export async function getCompanyInternships(companyId) {
  const response = await api.get(`/internships/company/${companyId}`);
  return response.data;
}

export async function createInternship(payload) {
  const response = await api.post("/internships", payload);
  return response.data;
}

export async function updateInternship(internshipId, payload) {
  const response = await api.put(`/internships/${internshipId}`, payload);
  return response.data;
}

export async function deleteInternship(internshipId) {
  const response = await api.delete(`/internships/${internshipId}`);
  return response.data;
}
