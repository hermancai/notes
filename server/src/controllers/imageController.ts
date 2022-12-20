import { Response, Request, NextFunction } from "express";
import s3Client from "../config/s3Connect";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import Image from "../models/Image";

const BUCKET_NAME = process.env.BUCKET_NAME!;

interface ImageWithPresignedURL {
  id: number;
  description: string;
  fileName: string;
  fileNameResized: string;
  updatedAt: Date;
  createdAt: Date;
  userId: string;
  presignedURL: string;
}

// Create presigned URL for getting image from AWS S3
const generateGetPresignedURL = async (fileName: string, bucket: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });
  // presigned URL expires in 24 hours
  return await getSignedUrl(s3Client, command, { expiresIn: 86400 });
};

// Delete all images belonging to user from S3
const deleteAllUserImages = async (userId: string) => {
  const allImages = await Image.findAll({ where: { userId } });

  for (const image of allImages) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: image.fileName,
    });
    await s3Client.send(command);
  }
};

// @desc   Send presigned URLs of thumbnails belonging to user
// @route  GET /api/image
const getAllImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const images = await Image.findAll({
    where: { userId: req.userId },
    order: [["updatedAt", "DESC"]],
  });

  if (images === null) {
    return res.status(400).json({ message: "Error: Get thumbnails" });
  }

  // Build new image list with presignedURLs
  const imageList: ImageWithPresignedURL[] = [];
  for (const image of images) {
    imageList.push({
      id: image.id,
      description: image.description,
      fileName: image.fileName,
      fileNameResized: image.fileNameResized,
      updatedAt: image.updatedAt,
      createdAt: image.createdAt,
      userId: image.userId,
      presignedURL: await generateGetPresignedURL(
        image.fileNameResized,
        BUCKET_NAME + "-resized"
      ),
    });
  }

  res
    .status(200)
    .json({ message: "Success: Get thumbnails", images: imageList });
};

// @desc   Generate presigned URL for upload to S3 bucket
// @route  GET /api/image/getUploadPresign
const getUploadPresignedURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileName = `${req.user}-${uuidv4()}.${req.body.fileType}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });
    const presignedURL = await getSignedUrl(s3Client, command);
    res.status(200).json({
      message: "Success: Uploaded image",
      presignedURL,
      fileName,
    });
  } catch (err) {
    throw err;
  }
};

// @desc   Save image entry to own database
// @route  POST /api/image
const saveImage = async (req: Request, res: Response, next: NextFunction) => {
  const { description, fileName } = req.body as {
    description: string;
    fileName: string;
  };

  if (!fileName) {
    return res.status(400).json({ message: "Error: Missing file name" });
  }

  const savedImage = await Image.create(
    {
      userId: req.userId,
      description,
      fileName,
      fileNameResized: "resized-" + fileName,
    },
    { returning: true }
  );
  if (!savedImage) {
    return res.status(500).json({ message: "Error: Save image failed" });
  }

  const newImage: ImageWithPresignedURL = {
    id: savedImage.id,
    description: savedImage.description,
    fileName: savedImage.fileName,
    fileNameResized: savedImage.fileNameResized,
    createdAt: savedImage.createdAt,
    updatedAt: savedImage.updatedAt,
    userId: savedImage.userId,
    presignedURL: await generateGetPresignedURL(
      savedImage.fileNameResized,
      BUCKET_NAME + "-resized"
    ),
  };

  res.status(200).json({ message: "Success: Upload image", newImage });
};

// @desc   Get presigned URL for one full sized image
// @route  POST /api/image/full
const getFullImageURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const presignedURL = await generateGetPresignedURL(
      req.body.imageKey,
      BUCKET_NAME
    );
    res.status(200).json({
      message: "Success: Get full image",
      presignedURL,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete user image from S3 and database
// @route  DELETE /api/image/
const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: "Error: Missing file name" });
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });
    await s3Client.send(command);
  } catch (err) {
    next(err);
  }

  try {
    const deletedImage = await Image.destroy({ where: { fileName, userId } });
    if (deletedImage === 0) {
      return res.status(400).json({ message: "Error: Delete image failed" });
    }
    return res.status(200).json({ message: "Success: Delete image" });
  } catch (err) {
    next(err);
  }
};

// @desc   Update existing image's description
// @route  PUT /api/image/
const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  if (!userId) {
    return res.status(400).json({ message: "Error: Missing user ID" });
  }

  const { fileName, description } = req.body;
  if (!fileName) {
    return res.status(400).json({ message: "Error: Missing file name" });
  }

  try {
    const updatedImage = await Image.update(
      { description },
      { where: { userId, fileName }, returning: true }
    );
    if (!updatedImage) {
      return res.status(400).json({ message: "Error: Image not found" });
    }

    const image = updatedImage[1][0];
    res.status(200).json({
      message: "Success: Update image",
      newDetails: {
        id: image.id,
        description: image.description,
        updatedAt: image.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export {
  getAllImages,
  getUploadPresignedURL,
  saveImage,
  getFullImageURL,
  deleteImage,
  updateImage,
  deleteAllUserImages,
};
