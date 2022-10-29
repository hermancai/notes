import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  username?: string;
  loggedIn: boolean;
}

const initialState: UserState = {
  loggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ accessToken: string; username: string }>
    ) => {
      localStorage.setItem("accessToken", action.payload.accessToken);
      state.loggedIn = true;
      state.username = action.payload.username;
    },
    resetUser: (state) => {
      localStorage.removeItem("accessToken");
      state.loggedIn = false;
      state.username = undefined;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
