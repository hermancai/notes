interface TokenPayload {
  username: string;
  userId: string;
}

interface Credentials {
  username: string;
  password: string;
}

interface NotePayload {
  id: number;
  title: string;
  text?: string;
}

export type { TokenPayload, Credentials, NotePayload };
