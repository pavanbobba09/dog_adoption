
const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

export async function loginUser(name, email) {
  return await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, email }),
  });
}

export async function logoutUser() {
  return await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function checkSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: "GET",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Session check error:", error);
    return false;
  }
}
