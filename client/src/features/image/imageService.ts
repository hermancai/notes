import * as Image from "../../interfaces/ImageInterfaces";
import { ServerResponse } from "../../interfaces/SharedInterfaces";
import protectedFetch from "../shared/protectedFetch";

// GET /api/image/getUploadPresign
const getUploadPresignedURL = async (
  fileType: string,
  fileSize: Blob["size"]
): Promise<Image.GetUploadURLResponse> => {
  return await protectedFetch<Image.GetUploadURLResponse>(() => {
    return fetch("/api/image/getUploadPresign", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileType, fileSize }),
    });
  });
};

// Get presigned upload URL and POST file to S3
const uploadToS3 = async (body: Image.NewImagePayload): Promise<string> => {
  if (body.file === undefined) {
    throw new Error("A file was not provided");
  }

  const fileType = body.file.name.split(".").pop();
  if (fileType === undefined) {
    throw new Error("Invalid file type");
  }

  // This already uses protectedFetch
  const response = await getUploadPresignedURL(fileType, body.file.size);

  // Upload file to S3
  const formData = new FormData();
  Object.keys(response.fields).forEach((key) => {
    formData.append(key, response.fields[key]);
  });
  formData.append("file", body.file);

  const s3Response = await fetch(response.url, {
    method: "POST",
    body: formData,
  });

  if (!s3Response.ok) throw new Error("Upload to S3 failed");
  return response.fileName;
};

// PUT using presigned URL
const uploadImage = async (
  body: Image.NewImagePayload
): Promise<Image.SaveImageResponse> => {
  const fileName = await uploadToS3(body);

  // Save image data to own database
  return await protectedFetch<Image.SaveImageResponse>(() => {
    return fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        fileName,
        description: body.description,
      }),
    });
  });
};

// GET /api/image
const getAllImages = async (): Promise<Image.GetImagesResponse> => {
  return await protectedFetch<Image.GetImagesResponse>(() => {
    return fetch("/api/image", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  });
};

// POST /api/image/full
const getFullImageURL = async (
  imageKey: Image.Image["fileName"]
): Promise<Image.FullImageResponse["presignedURL"]> => {
  const res = await protectedFetch<Image.FullImageResponse>(() => {
    return fetch("/api/image/full", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ imageKey }),
    });
  });

  return res.presignedURL;
};

// DELETE /api/image
const deleteImage = async (
  fileName: Image.PresignedImage["fileName"]
): Promise<ServerResponse> => {
  return await protectedFetch<ServerResponse>(() => {
    return fetch("/api/image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ fileName }),
    });
  });
};

// PUT /api/image
const updateImage = async (
  body: Image.UpdateImageRequest
): Promise<Image.UpdateImageResponse> => {
  return await protectedFetch<Image.UpdateImageResponse>(() => {
    return fetch("/api/image", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(body),
    });
  });
};

export const imageService = {
  uploadImage,
  getAllImages,
  getFullImageURL,
  deleteImage,
  updateImage,
};
