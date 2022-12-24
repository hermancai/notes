import { ServerResponse } from "shared";
import * as User from "shared/lib/types/UserInterfaces";
import refreshAccessToken from "../shared/refreshAccessToken";
import protectedFetch from "../shared/protectedFetch";

// POST /api/token
const verifyAccessToken = async (): Promise<User.TokenResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  // Send current access token for verification
  if (accessToken !== null) {
    const verifyResponse = await fetch("/api/token", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (verifyResponse.status === 200) {
      return (await verifyResponse.json()) as User.TokenResponse;
    }
  }

  return await refreshAccessToken();
};

// POST /api/user/login
const login = async (
  credentials: User.Credentials
): Promise<User.LoginResponse> => {
  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const res = (await response.json()) as User.LoginResponse;
  if (response.status !== 200) {
    localStorage.removeItem("accessToken");
    res.error = true;
    return res;
  }

  localStorage.setItem("accessToken", res.accessToken!);
  res.error = false;
  return res;
};

// POST /api/user/signup
const signup = async (
  credentials: User.Credentials
): Promise<User.SignupResponse> => {
  const response = await fetch("/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const res = (await response.json()) as User.SignupResponse;
  if (response.status !== 200) {
    res.error = true;
    return res;
  }

  res.error = false;
  return res;
};

// DELETE /api/token
const logout = async (): Promise<ServerResponse> => {
  const response = await fetch("/api/token", {
    method: "DELETE",
    credentials: "include",
  });
  localStorage.removeItem("accessToken");
  return (await response.json()) as ServerResponse;
};

// DELETE /api/user
const deleteAccount = async (): Promise<ServerResponse> => {
  const res = await protectedFetch<ServerResponse>(() => {
    return fetch("/api/user", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  });

  localStorage.removeItem("accessToken");
  return res;
};

const userService = {
  verifyAccessToken,
  login,
  signup,
  logout,
  deleteAccount,
};
export default userService;
