export interface Note {
  id: number;
  text: string;
  title: string;
  updatedAt: Date | string | number;
  createdAt: Date | string | number;
  userId: string;
}

// POST /api/note
export interface NewNoteRequest {
  title: string;
  text: string;
}

// POST /api/note
export interface NewNoteResponse {
  note: Note;
}

// GET /api/note
export interface GetNotesResponse {
  notes: Note[];
}

// PUT /api/note
export interface UpdateNoteRequest {
  id: number;
  title: string;
  text?: string;
}
// PUT /api/note
export interface UpdateNoteResponse {
  note: {
    text: Note["text"];
    title: Note["title"];
    updatedAt: Note["updatedAt"];
    id: Note["id"];
  };
}
