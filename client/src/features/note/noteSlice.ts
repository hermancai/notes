import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as Note from "../../types/NoteInterfaces";
import { SortModes } from "../../types/UserInterfaces";
import noteService from "./noteService";

export interface NoteState {
  allNotes: Note.Note[];
  id?: number;
  title?: string;
  text?: string;
  loading: boolean;
  initialFetch: boolean;
  sortMode: SortModes["sortMode"];
}

export interface UpdateNoteBody extends Note.NewNoteRequest {
  id: number;
}

const initialState: NoteState = {
  allNotes: [],
  loading: false,
  initialFetch: false,
  sortMode: "Last Updated",
};

export const createNewNote = createAsyncThunk(
  "note/createNewNote",
  async (contents: Note.NewNoteRequest, thunkAPI) => {
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
    await noteService.deleteNote(id);
    return id;
  }
);

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNote: (state, { payload }: PayloadAction<Note.Note>) => {
      state.id = payload.id;
      state.title = payload.title;
      state.text = payload.text;
    },
    resetNote: (state) => {
      state.id = undefined;
      state.title = undefined;
      state.text = undefined;
    },
    sortNoteList: (
      state,
      { payload }: PayloadAction<SortModes["sortMode"]>
    ) => {
      state.sortMode = payload;
      switch (payload) {
        case "Oldest":
          state.allNotes.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          break;
        case "Newest":
          state.allNotes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
          break;
        case "Last Updated":
          state.allNotes.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
          break;
      }
    },
    resetAllNotes: (state) => {
      state.allNotes = [];
      state.initialFetch = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.initialFetch = true;
        state.loading = true;
      })
      .addCase(getNotes.fulfilled, (state, { payload }) => {
        state.allNotes = payload.notes;
        state.allNotes.forEach((note) => {
          note.createdAt = new Date(note.createdAt).getTime();
          note.updatedAt = new Date(note.updatedAt).getTime();
        });
        state.loading = false;
        state.initialFetch = true;
      })
      .addCase(getNotes.rejected, (state) => {
        state.loading = false;
        state.initialFetch = false;
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allNotes.forEach((note) => {
          if (note.id === payload.note.id) {
            note.title = payload.note.title;
            note.text = payload.note.text;
            note.updatedAt = new Date(payload.note.updatedAt).getTime();
          }
        });
      })
      .addCase(updateNote.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteNote.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.id = undefined;
        state.text = undefined;
        state.title = undefined;
        state.allNotes = state.allNotes.filter((note) => note.id !== payload);
      })
      .addCase(deleteNote.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createNewNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewNote.fulfilled, (state, { payload }) => {
        state.loading = false;
        payload.note.createdAt = new Date(payload.note.createdAt).getTime();
        payload.note.updatedAt = new Date(payload.note.updatedAt).getTime();
        state.allNotes.push(payload.note);
      })
      .addCase(createNewNote.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setNote, resetNote, sortNoteList, resetAllNotes } =
  noteSlice.actions;
export default noteSlice.reducer;
