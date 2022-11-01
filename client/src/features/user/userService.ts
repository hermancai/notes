import { ServerResponse, Credentials } from "../../interfaces/interfaces";

// POST /api/token
const verifyAccessToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  // Send current access token for verification
  if (accessToken !== null) {
    const verifyResponse = await fetch("/api/token", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const verifyRes = (await verifyResponse.json()) as ServerResponse;

    // Exit if current access token is valid
    if (!verifyRes.error) {
      return verifyRes;
    }
  }

  // Get new access token using refresh token
  const refreshResponse = await fetch("/api/token", {
    method: "PUT",
    credentials: "include",
  });
  const refreshRes = (await refreshResponse.json()) as ServerResponse;

  if (refreshRes.error) {
    throw new Error("Client: " + refreshRes.message);
  }

  return refreshRes;
};

// POST /api/user/login
const login = async (credentials: Credentials) => {
  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return (await response.json()) as ServerResponse;
};

// POST /api/user/signup
const signup = async (credentials: Credentials) => {
  const response = await fetch("/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return (await response.json()) as ServerResponse;
};

// DELETE /api/token
const logout = async () => {
  const response = await fetch("/api/token", {
    method: "DELETE",
    credentials: "include",
  });
  return (await response.json()) as ServerResponse;
};

const userService = { verifyAccessToken, login, signup, logout };
export default userService;
