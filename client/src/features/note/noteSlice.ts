import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Note, NewNotePayload } from "../../interfaces/interfaces";
import noteService from "./noteService";

export interface NoteState {
  allNotes: Note[];
  id?: number;
  title?: string;
  text?: string;
  loading: boolean;
}

export interface UpdateNoteBody extends NewNotePayload {
  id: number;
}

const initialState: NoteState = { allNotes: [], loading: false };

export const createNewNote = createAsyncThunk(
  "note/createNewNote",
  async (contents: NewNotePayload, thunkAPI) => {
    return await noteService.createNewNote(contents);
  }
);

export const getNotes = createAsyncThunk(
  "note/getNotes",
  async (_, thunkAPI) => {
    return await noteService.getNotes();
  }
);

export const updateNote = createAsyncThunk(
  "note/updateNote",
  async (body: UpdateNoteBody, thunkAPI) => {
    return await noteService.updateNote(body);
  }
);

export const deleteNote = createAsyncThunk(
  "note/deleteNote",
  async (id: number, thunkAPI) => {
    return await noteService.deleteNote(id);
  }
);

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNote: (state, { payload }: PayloadAction<Note>) => {
      state.id = payload.id;
      state.title = payload.title;
      state.text = payload.text;
    },
    resetNote: (state) => {
      state.id = undefined;
      state.title = undefined;
      state.text = undefined;
    },
    removeNoteFromList: (state, { payload }: PayloadAction<{ id: number }>) => {
      return {
        ...state,
        allNotes: [...state.allNotes].filter((note) => note.id !== payload.id),
      };
    },
    sortNoteList: (
      state,
      { payload }: PayloadAction<"old" | "new" | "update">
    ) => {
      switch (payload) {
        case "old":
          state.allNotes.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          break;
        case "new":
          state.allNotes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
          break;
        case "update":
          state.allNotes.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotes.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allNotes = payload.notes;
        state.allNotes.forEach((note) => {
          note.createdAt = new Date(note.createdAt).getTime();
          note.updatedAt = new Date(note.updatedAt).getTime();
        });
      })
      .addCase(getNotes.rejected, (state) => {
        state.loading = false;
        state.allNotes = [];
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state) => {
        state.loading = false;
        state.id = undefined;
        state.text = undefined;
        state.title = undefined;
      })
      .addCase(updateNote.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state) => {
        state.loading = false;
        state.id = undefined;
        state.text = undefined;
        state.title = undefined;
      })
      .addCase(deleteNote.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setNote, resetNote, removeNoteFromList, sortNoteList } =
  noteSlice.actions;
export default noteSlice.reducer;
