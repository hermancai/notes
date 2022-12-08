import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/user/userSlice";
import noteSlice from "../features/note/noteSlice";
import imageSlice from "../features/image/imageSlice";
import toastSlice from "../features/toast/toastSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    note: noteSlice,
    image: imageSlice,
    toast: toastSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
