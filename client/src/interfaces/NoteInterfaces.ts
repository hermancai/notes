import { SharedInterfaces } from "./SharedInterfaces";

export namespace NoteInterfaces {
  export interface Note {
    id: number;
    text: string;
    title: string;
    updatedAt: string | number;
    createdAt: string | number;
    userId: string;
  }

  export interface GetNotesResponse extends SharedInterfaces.ServerResponse {
    notes: Note[];
  }

  export interface NewNotePayload {
    title: string;
    text: string;
  }

  export interface NewNoteResponse extends SharedInterfaces.ServerResponse {
    dataValues: Note;
  }

  export interface UpdateNoteResponse extends SharedInterfaces.ServerResponse {
    note: Note;
  }
}
