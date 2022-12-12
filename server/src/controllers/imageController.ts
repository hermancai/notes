import { Response, Request, NextFunction } from "express";
import s3Client from "../config/s3Connect";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
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

const generateGetPresignedURL = async (
  fileName: string,
  bucketSuffix: string
) => {
  const bucketParams: GetObjectCommandInput = {
    Bucket: BUCKET_NAME + bucketSuffix,
    Key: fileName,
  };

  const command = new GetObjectCommand(bucketParams);
  // presigned URL expires in 24 hours
  return await getSignedUrl(s3Client, command, { expiresIn: 86400 });
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
    return res
      .status(400)
      .json({ error: true, message: "Retrieving images failed" });
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
        "-resized"
      ),
    });
  }

  res
    .status(200)
    .json({ error: false, message: "Retrieved all images", images: imageList });
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
      error: false,
      message: "Image upload successful",
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
    return res.status(400).json({ error: true, message: "Missing file name" });
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
    return res.status(400).json({ error: true, message: "Image save failed" });
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
      "-resized"
    ),
  };

  res
    .status(200)
    .json({ error: false, message: "Image save successful", newImage });
};

// @desc   Get presigned URL for one full sized image
// @route  POST /api/image/full
const getFullImageURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const presignedURL = await generateGetPresignedURL(req.body.imageKey, "");
    res.status(200).json({
      error: false,
      message: "URL created successfully",
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
    return next(new Error("Missing file name"));
  }

  try {
    const bucketParams: DeleteObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };
    const command = new DeleteObjectCommand(bucketParams);
    await s3Client.send(command);
  } catch (err) {
    next(err);
  }

  try {
    const deletedImage = await Image.destroy({ where: { fileName, userId } });
    if (deletedImage === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Image deletion failed" });
    }
    return res
      .status(200)
      .json({ error: false, message: "Image deletion successful" });
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
};
