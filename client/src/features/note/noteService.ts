import * as Note from "../../types/NoteInterfaces";
import { UpdateNoteBody } from "./noteSlice";
import protectedFetch from "../shared/protectedFetch";

// POST /api/note
const createNewNote = async (
  contents: Note.NewNoteRequest
): Promise<Note.NewNoteResponse> => {
  return await protectedFetch<Note.NewNoteResponse>(() => {
    return fetch(`${process.env.REACT_APP_API_URL || ""}/api/note`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contents),
    });
  });
};

// GET /api/note
const getNotes = async (): Promise<Note.GetNotesResponse> => {
  return await protectedFetch<Note.GetNotesResponse>(() => {
    return fetch(`${process.env.REACT_APP_API_URL || ""}/api/note`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  });
};

// PUT /api/note
const updateNote = async (
  body: UpdateNoteBody
): Promise<Note.UpdateNoteResponse> => {
  return await protectedFetch<Note.UpdateNoteResponse>(() => {
    return fetch(`${process.env.REACT_APP_API_URL || ""}/api/note`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(body),
    });
  });
};

// DELETE /api/note
const deleteNote = async (id: number): Promise<void> => {
  return await protectedFetch<void>(() => {
    return fetch(`${process.env.REACT_APP_API_URL || ""}/api/note`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ id }),
    });
  });
};

const noteService = { createNewNote, getNotes, updateNote, deleteNote };
export default noteService;
