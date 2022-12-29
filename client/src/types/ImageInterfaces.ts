export interface Image {
  id: number;
  description: string;
  fileName: string;
  fileNameResized: string;
  fileNameOriginal: string;
  updatedAt: Date | string | number;
  createdAt: Date | string | number;
  userId: string;
}

export interface PresignedImage extends Image {
  presignedURL: string;
}

// GET /api/image
export interface GetAllImagesResponse {
  images: PresignedImage[];
}

// POST /api/image/getUploadPresign
export interface GetUploadURLResponse {
  url: string;
  fields: Record<string, string>;
  fileName: Image["fileName"];
}

// POST /api/image
export interface SaveImageRequest {
  file: File | undefined;
  fileNameOriginal: string;
  description: string;
}

// POST /api/image
export interface SaveImageResponse {
  newImage: PresignedImage;
}

// POST /api/image/full
export interface FullImageRequest {
  fileName: Image["fileName"];
  fileNameOriginal: Image["fileNameOriginal"];
}

// POST /api/image/full
export interface FullImageResponse {
  presignedURL: string;
}

// PUT /api/image
export interface UpdateImageRequest {
  fileName: Image["fileName"];
  description: Image["description"];
}

// PUT /api/image
export interface UpdateImageResponse {
  newDetails: {
    id: Image["id"];
    updatedAt: Image["updatedAt"];
    description: Image["description"];
  };
}
