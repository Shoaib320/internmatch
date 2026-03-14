import api from "./api";

export async function createApplication(payload) {
  const response = await api.post("/applications", payload);
  return response.data;
}

export async function getStudentApplications(studentId) {
  const response = await api.get(`/applications/student/${studentId}`);
  return response.data;
}

export async function getCompanyApplications(companyId) {
  const response = await api.get(`/applications/company/${companyId}`);
  return response.data;
}

export async function updateApplicationStatus(applicationId, status) {
  const response = await api.put(`/applications/${applicationId}/status`, { status });
  return response.data;
}
