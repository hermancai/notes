import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import userService from "./userService";
import { Credentials } from "../../types/UserInterfaces";

export interface UserState {
  username?: string;
  loading: boolean;
  colorMode: "light" | "dark";
  searchQuery: string;
}

const initialState: UserState = {
  loading: true,
  colorMode: "dark",
  searchQuery: "",
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
    setSearchQuery: (state, { payload }: PayloadAction<string>) => {
      state.searchQuery = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAccessToken.pending, (state) => {
        state.loading = true;
        state.username = undefined;
      })
      .addCase(verifyAccessToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.username = payload.username;
      })
      .addCase(verifyAccessToken.rejected, (state) => {
        state.loading = false;
        state.username = undefined;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.username = undefined;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.username = payload.username;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.username = undefined;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
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
        state.loading = false;
        state.username = undefined;
      })
      .addCase(deleteAccount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  getColorMode,
  setColorMode,
  stopLoading,
  resetUser,
  setSearchQuery,
} = userSlice.actions;
export default userSlice.reducer;
