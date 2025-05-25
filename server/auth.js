export function isLoggedInRecently() {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const lastLogin = payload.lastLogin;
    return Date.now() - lastLogin < 7 * 24 * 60 * 60 * 1000; // 7 days
  } catch {
    return false;
  }
}
