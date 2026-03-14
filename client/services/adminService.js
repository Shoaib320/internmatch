import api from "./api";

export async function getAdminDashboard() {
  const response = await api.get("/admin/dashboard");
  return response.data;
}

export async function getAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}

export async function getAdminCompanies() {
  const response = await api.get("/admin/companies");
  return response.data;
}

export async function getAdminInternships() {
  const response = await api.get("/admin/internships");
  return response.data;
}

export async function deleteAdminUser(userId) {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
}

export async function deleteAdminCompany(companyId) {
  const response = await api.delete(`/admin/companies/${companyId}`);
  return response.data;
}

export async function deleteAdminInternship(internshipId) {
  const response = await api.delete(`/admin/internships/${internshipId}`);
  return response.data;
}
