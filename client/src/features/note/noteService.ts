import { SharedInterfaces } from "../../interfaces/SharedInterfaces";
import { NoteInterfaces } from "../../interfaces/NoteInterfaces";
import { UpdateNoteBody } from "./noteSlice";
import refreshAccessToken from "../shared/refreshAccessToken";

// POST /api/note
const createNewNote = async (contents: NoteInterfaces.NewNotePayload) => {
  const fetchRequest = async (contents: NoteInterfaces.NewNotePayload) => {
    return await fetch("/api/note", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contents),
    });
  };

  const initialResponse = await fetchRequest(contents);
  if (initialResponse.status === 401) {
    const refreshRes = await refreshAccessToken();
    if (refreshRes.error) {
      throw new Error(refreshRes.message);
    }
    const retryResponse = await fetchRequest(contents);
    const retryRes =
      (await retryResponse.json()) as NoteInterfaces.NewNoteResponse;
    if (retryRes.error) {
      throw new Error(retryRes.message);
    }
    return retryRes;
  }
  const initialRes =
    (await initialResponse.json()) as NoteInterfaces.NewNoteResponse;
  if (initialRes.error) {
    throw new Error(initialRes.message);
  }
  return initialRes;
};

// GET /api/note
const getNotes = async () => {
  const fetchRequest = async () => {
    return await fetch("/api/note", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  };

  const initialResponse = await fetchRequest();
  if (initialResponse.status === 401) {
    const refreshResponse = await refreshAccessToken();
    if (refreshResponse.error) {
      throw new Error(refreshResponse.message);
    }
    const retryResponse = await fetchRequest();
    const retryRes =
      (await retryResponse.json()) as NoteInterfaces.GetNotesResponse;
    if (retryRes.error) {
      throw new Error(retryRes.message);
    }
    return retryRes;
  }
  const initialRes =
    (await initialResponse.json()) as NoteInterfaces.GetNotesResponse;
  if (initialRes.error) {
    throw new Error(initialRes.message);
  }
  return initialRes;
};

// PUT /api/note
const updateNote = async (body: UpdateNoteBody) => {
  const fetchRequest = async (body: UpdateNoteBody) => {
    return await fetch("/api/note", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(body),
    });
  };

  const initialResponse = await fetchRequest(body);
  if (initialResponse.status === 401) {
    const refreshResponse = await refreshAccessToken();
    if (refreshResponse.error) {
      throw new Error(refreshResponse.message);
    }
    const retryResponse = await fetchRequest(body);
    const retryRes =
      (await retryResponse.json()) as NoteInterfaces.UpdateNoteResponse;
    if (retryRes.error) {
      throw new Error(retryRes.message);
    }
    return retryRes;
  }
  const initialRes =
    (await initialResponse.json()) as NoteInterfaces.UpdateNoteResponse;
  if (initialRes.error) {
    throw new Error(initialRes.message);
  }
  return initialRes;
};

// DELETE /api/note
const deleteNote = async (id: number) => {
  const fetchRequest = async (id: number) => {
    return await fetch("/api/note", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ id }),
    });
  };

  const initialResponse = await fetchRequest(id);
  if (initialResponse.status === 401) {
    const refreshResponse = await refreshAccessToken();
    if (refreshResponse.error) {
      throw new Error(refreshResponse.message);
    }
    const retryResponse = await fetchRequest(id);
    const retryRes =
      (await retryResponse.json()) as SharedInterfaces.ServerResponse;
    if (retryRes.error) {
      throw new Error(retryRes.message);
    }
    return retryRes;
  }
  const initialRes =
    (await initialResponse.json()) as SharedInterfaces.ServerResponse;
  if (initialRes.error) {
    throw new Error(initialRes.message);
  }
  return initialRes;
};

const noteService = { createNewNote, getNotes, updateNote, deleteNote };
export default noteService;
