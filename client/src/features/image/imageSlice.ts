import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { imageService } from "./imageService";
import { ImageInterfaces } from "../../interfaces/ImageInterfaces";

export interface ImageState {
  allImages: ImageInterfaces.ImageWithPresignedURL[];
  activeImage?: ImageInterfaces.ImageWithPresignedURL;
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

export const getFullImage = createAsyncThunk(
  "image/getFullImage",
  async (imageKey: ImageInterfaces.Image["fileName"], thunkAPI) => {
    return await imageService.getFullImageURL(imageKey);
  }
);

export const deleteImage = createAsyncThunk(
  "image/deleteImage",
  async (
    fileName: ImageInterfaces.ImageWithPresignedURL["fileName"],
    thunkAPI
  ) => {
    await imageService.deleteImage(fileName);
    return fileName;
  }
);

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    resetImageState: (state) => {
      state.allImages = [];
      state.activeImage = undefined;
    },
  },
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
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteImage.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.activeImage = undefined;
        state.allImages = state.allImages.filter(
          (image) => image.fileName !== payload
        );
      })
      .addCase(deleteImage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetImageState } = imageSlice.actions;
export default imageSlice.reducer;
