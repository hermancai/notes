export interface Note {
  id: number;
  text: string;
  title: string;
  updatedAt: string | number;
  createdAt: string | number;
  userId: string;
}

export interface NewNotePayload {
  title: string;
  text: string;
}

export interface GetNotesResponse {
  notes: Note[];
}

export interface NewNoteResponse {
  note: Note;
}

export interface UpdateNoteResponse {
  note: {
    text: Note["text"];
    title: Note["title"];
    updatedAt: Note["updatedAt"];
    id: Note["id"];
  };
}
