import { TokenResponse } from "../../types/UserInterfaces";

// PUT /api/token
const refreshAccessToken = async (): Promise<TokenResponse> => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL || ""}/api/token`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  const res = (await response.json()) as TokenResponse;

  res.error = true;
  if (response.status !== 200) {
    localStorage.removeItem("accessToken");
    throw new Error(res.message);
  }

  if (res.accessToken === undefined) {
    throw new Error("Token refresh failed");
  }

  localStorage.setItem("accessToken", res.accessToken);
  res.error = false;
  return res;
};

export default refreshAccessToken;
