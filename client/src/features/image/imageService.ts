import { ImageInterfaces } from "../../interfaces/ImageInterfaces";

// GET /api/image/getUploadPresign
const getUploadPresignedURL = async (fileType: string) => {
  const response = await fetch("/api/image/getUploadPresign", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileType }),
  });
  const res = (await response.json()) as ImageInterfaces.NewImageResponse;

  // TODO handle 403 errors

  return res;
};

// PUT using presigned URL
const uploadImage = async (body: ImageInterfaces.NewImagePayload) => {
  if (body.file === undefined) {
    throw new Error("A file was not provided");
  }

  const fileType = body.file.name.split(".").pop();
  if (fileType === undefined) {
    throw new Error("Invalid file type");
  }

  const response = await getUploadPresignedURL(fileType);
  // Upload file to S3
  await fetch(response.presignedURL, { method: "PUT", body: body.file });

  // Save image entry to own database
  await fetch("/api/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify({
      fileName: response.fileName,
      description: body.description,
    }),
  });
};

// GET /api/image
const getAllImages = async () => {
  const response = await fetch("/api/image", {
    method: "GET",
    headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
  });
  return (await response.json()) as ImageInterfaces.GetImagesResponse;
};

// POST /api/image/full
const getFullImageURL = async (imageKey: ImageInterfaces.Image["fileName"]) => {
  const response = await fetch("/api/image/full", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify({ imageKey }),
  });
  const res = (await response.json()) as ImageInterfaces.FullImageResponse;
  return res.presignedURL;
};

// DELETE /api/image
const deleteImage = async (
  fileName: ImageInterfaces.ImageWithPresignedURL["fileName"]
) => {
  await fetch("/api/image", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify({ fileName }),
  });
};

export const imageService = {
  uploadImage,
  getAllImages,
  getFullImageURL,
  deleteImage,
};
