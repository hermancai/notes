import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { imageService } from "./imageService";
import { ImageInterfaces } from "../../interfaces/ImageInterfaces";
import { SharedInterfaces } from "../../interfaces/SharedInterfaces";

export interface ImageState {
  allImages: ImageInterfaces.ImageWithPresignedURL[];
  activeImage?: ImageInterfaces.ImageWithPresignedURL;
  loading: boolean;
  initialFetch: boolean;
  sortMode: SharedInterfaces.SortModes["sortMode"];
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

export const updateImage = createAsyncThunk(
  "image/updateImage",
  async (body: ImageInterfaces.UpdateImageRequest, thunkAPI) => {
    // TODO return full image details
    return await imageService.updateImage(body);
  }
);

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (
      state,
      { payload }: PayloadAction<ImageInterfaces.ImageWithPresignedURL>
    ) => {
      state.activeImage = payload;
    },
    resetImageState: (state) => {
      state.allImages = [];
      state.activeImage = undefined;
    },
    sortImageList: (
      state,
      { payload }: PayloadAction<SharedInterfaces.SortModes["sortMode"]>
    ) => {
      state.sortMode = payload;
      switch (payload) {
        case "Oldest":
          state.allImages.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          break;
        case "Newest":
          state.allImages.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
          break;
        case "Last Updated":
          state.allImages.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
          break;
      }
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
        state.allImages.forEach((image) => {
          image.createdAt = new Date(image.createdAt).getTime();
          image.updatedAt = new Date(image.updatedAt).getTime();
        });
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
        payload.newImage.createdAt = new Date(
          payload.newImage.createdAt
        ).getTime();
        payload.newImage.updatedAt = new Date(
          payload.newImage.updatedAt
        ).getTime();
        state.allImages.push(payload.newImage);
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

export const { resetImageState, sortImageList } = imageSlice.actions;
export default imageSlice.reducer;
