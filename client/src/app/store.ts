import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/user/userSlice";
import noteSlice from "../features/note/noteSlice";

export const store = configureStore({
  reducer: { user: userSlice, note: noteSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
