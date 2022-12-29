export interface SortModes {
  sortMode: "Oldest" | "Newest" | "Last Updated";
}

export interface Credentials {
  username: string;
  password: string;
}

export interface TokenPayload {
  username: string;
  userId: string;
}

// PUT /api/token
export interface TokenResponse {
  message: string;
  error: boolean;
  username: string;
  accessToken?: string;
}

// POST /api/user/signup
export interface SignupResponse {
  message: string;
  error: boolean;
}

// POST /api/user/login
export interface LoginResponse {
  message: string;
  error: boolean;
  username: string;
  accessToken?: string;
}
