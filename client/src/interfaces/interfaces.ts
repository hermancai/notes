interface ServerResponse {
  error: boolean;
  message: string;
  accessToken?: string;
  username?: string;
}

export type { ServerResponse };
