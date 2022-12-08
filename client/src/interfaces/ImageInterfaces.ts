import { SharedInterfaces } from "./SharedInterfaces";

export namespace ImageInterfaces {
  export interface Image {
    id: number;
    description: string;
    s3Key: string;
    s3KeyResized: string;
    updatedAt: string | number;
    createdAt: string | number;
    userId: string;
  }

  export interface ImageWithPresignedURL extends Image {
    presignedURL: string;
  }

  export interface NewImagePayload {
    file: File | undefined;
    description: string;
  }

  export interface NewImageResponse extends SharedInterfaces.ServerResponse {
    presignedURL: string;
    fileName: string;
  }

  export interface GetImagesResponse extends SharedInterfaces.ServerResponse {
    images: ImageWithPresignedURL[];
  }
}
