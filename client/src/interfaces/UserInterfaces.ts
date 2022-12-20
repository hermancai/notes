export interface Credentials {
  username: string;
  password: string;
}

export interface TokenPayload {
  username: string;
  userId: string;
}

export interface TokenResponse {
  message: string;
  error: boolean;
  username: string;
  accessToken?: string;
}

export interface LoginResponse {
  message: string;
  error: boolean;
  username: string;
  accessToken?: string;
}

export interface SignupResponse {
  message: string;
  error: boolean;
}
