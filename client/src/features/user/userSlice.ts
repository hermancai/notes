import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";
import { Credentials } from "../../interfaces/interfaces";

export interface UserState {
  username?: string;
  loading: boolean;
  colorMode: "light" | "dark";
}

const initialState: UserState = {
  loading: true,
  colorMode: "dark",
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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getColorMode: (state) => {
      const mode = localStorage.getItem("colorMode");
      if (mode === "light") {
        state.colorMode = "light";
      } else {
        state.colorMode = "dark";
      }
    },
    setColorMode: (state) => {
      const newMode = state.colorMode === "light" ? "dark" : "light";
      state.colorMode = newMode;
      localStorage.setItem("colorMode", newMode);
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    resetUser: (state) => {
      state.loading = false;
      state.username = undefined;
      localStorage.removeItem("accessToken");
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
      })
      .addCase(verifyAccessToken.rejected, (state) => {
        state.loading = false;
        state.username = undefined;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (!payload.error) {
          localStorage.setItem("accessToken", payload.accessToken!);
          state.username = payload.username;
        }
      })
      .addCase(login.rejected, (state) => {
        localStorage.removeItem("accessToken");
        state.loading = false;
        state.username = undefined;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.username = undefined;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
        state.username = undefined;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("accessToken");
        state.loading = false;
        state.username = undefined;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        localStorage.removeItem("accessToken");
        state.loading = false;
      })
      .addCase(deleteAccount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { getColorMode, setColorMode, stopLoading, resetUser } =
  userSlice.actions;
export default userSlice.reducer;
