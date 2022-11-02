interface ServerResponse {
  error: boolean;
  message: string;
  accessToken?: string;
  username?: string;
  status?: number;
}

interface Credentials {
  username: string;
  password: string;
}

export type { ServerResponse, Credentials };
