import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { imageService } from "./imageService";
import { ImageInterfaces } from "../../interfaces/ImageInterfaces";

export interface ImageState {
  allImages: ImageInterfaces.ImageWithPresignedURL[];
  id?: number;
  description?: string;
  loading: boolean;
  initialFetch: boolean;
  sortMode: "Oldest" | "Newest" | "Last Updated";
}

const initialState: ImageState = {
  allImages: [],
  loading: false,
  initialFetch: false,
  sortMode: "Last Updated",
};

export const getAllImages = createAsyncThunk(
  "image/getAllImages",
  async (_, thunkAPI) => {
    return await imageService.getAllImages();
  }
);

export const uploadImage = createAsyncThunk(
  "image/uploadImage",
  async (body: ImageInterfaces.NewImagePayload, thunkAPI) => {
    return await imageService.uploadImage(body);
  }
);

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllImages.pending, (state) => {
        state.initialFetch = true;
        state.loading = true;
      })
      .addCase(getAllImages.fulfilled, (state, { payload }) => {
        state.allImages = payload.images;
        state.loading = false;
        state.initialFetch = true;
      })
      .addCase(getAllImages.rejected, (state) => {
        state.loading = false;
        state.initialFetch = false;
      })
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImage.fulfilled, (state, { payload }) => {
        state.loading = false;
        // TODO
      })
      .addCase(uploadImage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {} = imageSlice.actions;
export default imageSlice.reducer;
