import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ToastMessage {
  message: string;
  key: number;
}

export interface ToastState {
  toastList: ToastMessage[];
  open: boolean;
  currentToast: ToastMessage | undefined;
}

const initialState: ToastState = {
  toastList: [],
  open: false,
  currentToast: undefined,
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setOpen: (state, { payload }: PayloadAction<ToastState["open"]>) => {
      state.open = payload;
    },
    clearCurrentToast: (state) => {
      state.currentToast = undefined;
    },
    showNextToast: (state) => {
      state.currentToast = state.toastList[0];
      state.toastList.shift();
      state.open = true;
    },
    makeToast: (state, { payload }: PayloadAction<string>) => {
      state.toastList.push({ message: payload, key: new Date().getTime() });
    },
    clearAllToasts: (state) => {
      state.open = false;
      state.currentToast = undefined;
      state.toastList = [];
    },
  },
});

export const {
  setOpen,
  clearCurrentToast,
  showNextToast,
  makeToast,
  clearAllToasts,
} = toastSlice.actions;
export default toastSlice.reducer;
