import { ServerResponse, Credentials } from "../../interfaces/interfaces";
import refreshAccessToken from "../shared/refreshAccessToken";

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

  return await refreshAccessToken();
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

// DELETE /api/user
const deleteAccount = async () => {
  const fetchRequest = async () => {
    return await fetch("/api/user", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  };

  const initialResponse = await fetchRequest();
  if (initialResponse.status === 401) {
    const refreshResponse = await refreshAccessToken();
    if (refreshResponse.error) {
      throw new Error(refreshResponse.message);
    }
    const retryResponse = await fetchRequest();
    const retryRes = (await retryResponse.json()) as ServerResponse;
    if (retryRes.error) {
      throw new Error(retryRes.message);
    }
    return retryRes;
  }
};

// PUT /api/token
// For accessing protected pages when no default fetch is used
const getUsername = async () => {};

const userService = {
  verifyAccessToken,
  login,
  signup,
  logout,
  deleteAccount,
  getUsername,
};
export default userService;
