import { API_BASE, apiRequest } from "./api.js";

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Invalid email or password.");
  }

  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}

export async function registerUser(email, password, userData) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: userData.firstName,
      surname: userData.surname,
      email,
      programme: userData.programme,
      subprogramme: userData.subprogramme,
      position: userData.position,
      password,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed.");
  }
  return data.user;
}

export async function updateProfile(userId, profileData) {
  const data = await apiRequest(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({
      first_name: profileData.first_name,
      surname: profileData.surname,
      programme: profileData.programme,
      subprogramme: profileData.subprogramme,
      position: profileData.position,
    }),
  });
  sessionStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}

export function logoutUser() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export function getCurrentUser() {
  const user = sessionStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export const getToken = () => sessionStorage.getItem("token");
export const isLoggedIn = () => Boolean(getToken());

export async function resetPassword() {
  throw new Error("Password reset is not available yet.");
}
