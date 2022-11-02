import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import userService from "./userService";
import { Credentials } from "../../interfaces/interfaces";

export interface UserState {
  username?: string;
  loggedIn: boolean;
  loading: boolean;
}

const initialState: UserState = {
  loggedIn: false,
  loading: false,
};

export const verifyAccessToken = createAsyncThunk(
  "user/verifyAccessToken",
  async (_, thunkAPI) => {
    return await userService.verifyAccessToken();
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials: Credentials, thunkAPI) => {
    return await userService.login(credentials);
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async (credentials: Credentials, thunkAPI) => {
    return await userService.signup(credentials);
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  return await userService.logout();
});

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, thunkAPI) => {
    return await userService.deleteAccount();
  }
);

export const refreshAccessToken = createAsyncThunk(
  "user/refreshAccessToken",
  async (_, thunkAPI) => {
    return await userService.refreshAccessToken();
  }
);

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
      state.loggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAccessToken.fulfilled, (state, { payload }) => {
        localStorage.setItem("accessToken", payload.accessToken!);
        state.loading = false;
        state.username = payload.username;
        state.loggedIn = true;
      })
      .addCase(verifyAccessToken.rejected, (state) => {
        state.loading = false;
        state.username = undefined;
        state.loggedIn = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (!payload.error) {
          localStorage.setItem("accessToken", payload.accessToken!);
          state.username = payload.username;
          state.loggedIn = true;
        }
      })
      .addCase(login.rejected, (state) => {
        localStorage.removeItem("accessToken");
        state.loading = false;
        state.username = undefined;
        state.loggedIn = false;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.username = undefined;
        state.loggedIn = false;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
        state.username = undefined;
        state.loggedIn = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.username = undefined;
        state.loggedIn = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAccount.rejected, (state) => {
        state.loading = false;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (!payload.error) {
          localStorage.setItem("accessToken", payload.accessToken!);
          state.loggedIn = true;
          state.username = payload.username!;
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        localStorage.removeItem("accessToken");
        state.loading = false;
        state.loggedIn = false;
        state.username = undefined;
      });
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
