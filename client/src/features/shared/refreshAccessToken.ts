import { ServerResponse } from "../../interfaces/interfaces";

// PUT /api/token
const refreshAccessToken = async () => {
  const response = await fetch("/api/token", {
    method: "PUT",
    credentials: "include",
  });
  const res = (await response.json()) as ServerResponse;
  if (res.error) {
    localStorage.removeItem("accessToken");
    throw new Error(res.message);
  }
  localStorage.setItem("accessToken", res.accessToken!);
  return res;
};

export default refreshAccessToken;
