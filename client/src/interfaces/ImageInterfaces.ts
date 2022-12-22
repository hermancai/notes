export interface Image {
  id: number;
  description: string;
  fileName: string;
  fileNameResized: string;
  fileNameOriginal: string;
  updatedAt: string | number;
  createdAt: string | number;
  userId: string;
}

export interface PresignedImage extends Image {
  presignedURL: string;
}

export interface NewImagePayload {
  file: File | undefined;
  fileNameOriginal: string;
  description: string;
}

export interface GetUploadURLResponse {
  url: string;
  fields: Record<string, string>;
  fileName: Image["fileName"];
}

export interface SaveImageResponse {
  newImage: PresignedImage;
}

export interface GetImagesResponse {
  images: PresignedImage[];
}

export interface FullImageRequest {
  fileName: Image["fileName"];
  fileNameOriginal: Image["fileNameOriginal"];
}

export interface FullImageResponse {
  presignedURL: string;
}

export interface UpdateImageRequest {
  fileName: Image["fileName"];
  description: Image["description"];
}

export interface UpdateImageResponse {
  newDetails: {
    id: Image["id"];
    updatedAt: Image["updatedAt"];
    description: Image["description"];
  };
}
