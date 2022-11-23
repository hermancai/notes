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

interface NewNotePayload {
  title: string;
  text: string;
}

interface Note {
  id: number;
  text: string;
  title: string;
  updatedAt: string | number;
  createdAt: string | number;
  userId: string;
}

interface NewNoteResponse extends ServerResponse {
  dataValues: Note;
}

interface UpdateNoteResponse extends ServerResponse {
  note: Note;
}

export type {
  ServerResponse,
  Credentials,
  NewNotePayload,
  Note,
  NewNoteResponse,
  UpdateNoteResponse,
};
