export function getHomeRouteForRole(role) {
  if (role === "company") {
    return "/company/dashboard";
  }

  if (role === "admin") {
    return "/admin/dashboard";
  }

  return "/student/dashboard";
}
