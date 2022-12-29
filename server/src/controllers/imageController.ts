import { Response, Request, NextFunction } from "express";
import s3Client from "../config/s3Connect";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import Image from "../models/Image";
import { PresignedImage } from "../types/ImageInterfaces";

const BUCKET_NAME = process.env.BUCKET_NAME!;

// Create presigned URL for getting image from AWS S3
const generateGetPresignedURL = async (
  bucket: string,
  fileName: string,
  fileNameOriginal: string
) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileName,
    ResponseContentDisposition: `inline; filename="${encodeURIComponent(
      fileNameOriginal
    )}"`,
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
  const imageList: PresignedImage[] = [];
  for (const image of images) {
    imageList.push({
      id: image.id,
      description: image.description,
      fileName: image.fileName,
      fileNameResized: image.fileNameResized,
      fileNameOriginal: image.fileNameOriginal,
      updatedAt: image.updatedAt,
      createdAt: image.createdAt,
      userId: image.userId,
      presignedURL: await generateGetPresignedURL(
        BUCKET_NAME + "-resized",
        image.fileNameResized,
        image.fileNameOriginal
      ),
    });
  }

  res.status(200).json({ images: imageList });
};

// @desc   Generate presigned URL for upload to S3 bucket
// @route  POST /api/image/getUploadPresign
const getUploadPresignedURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Allow upload if user has < 10 images
  const imageCount = await Image.count({ where: { userId: req.userId } });
  if (imageCount >= 10) {
    return res.status(400).json({ message: "10 images max!" });
  }

  const { fileType, fileSize } = req.body;
  if (!fileSize || !fileType) {
    return res.status(400).json({ message: "Error: Missing file data" });
  }

  try {
    const fileName = `${req.user}-${uuidv4()}.${fileType}`;

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Fields: { acl: "private", "Content-Type": "image/" + fileType },
      Conditions: [
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, 10485760], // 10 Mb limit
      ],
    });

    res.status(200).json({
      fileName,
      url,
      fields,
    });
  } catch (err) {
    throw err;
  }
};

// @desc   Save image entry to own database
// @route  POST /api/image
const saveImage = async (req: Request, res: Response, next: NextFunction) => {
  const { description, fileName, fileNameOriginal } = req.body as {
    description: string;
    fileName: string;
    fileNameOriginal: string;
  };

  if (!fileName || !fileNameOriginal) {
    return res.status(400).json({ message: "Error: Missing file name" });
  }

  const savedImage = await Image.create(
    {
      userId: req.userId,
      description,
      fileName,
      fileNameResized: "resized-" + fileName,
      fileNameOriginal,
    },
    { returning: true }
  );
  if (!savedImage) {
    return res.status(500).json({ message: "Error: Save image failed" });
  }

  const newImage: PresignedImage = {
    id: savedImage.id,
    description: savedImage.description,
    fileName: savedImage.fileName,
    fileNameResized: savedImage.fileNameResized,
    fileNameOriginal: savedImage.fileNameOriginal,
    createdAt: savedImage.createdAt,
    updatedAt: savedImage.updatedAt,
    userId: savedImage.userId,
    presignedURL: await generateGetPresignedURL(
      BUCKET_NAME + "-resized",
      "resized-" + savedImage.fileName,
      savedImage.fileNameOriginal
    ),
  };

  res.status(200).json({ newImage });
};

// @desc   Get presigned URL for one full sized image
// @route  POST /api/image/full
const getFullImageURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fileName, fileNameOriginal } = req.body;

  if (!fileName || !fileNameOriginal) {
    return res.status(400).json({ message: "Error: Missing file data" });
  }

  try {
    const presignedURL = await generateGetPresignedURL(
      BUCKET_NAME,
      fileName,
      fileNameOriginal
    );
    res.status(200).json({
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
    return next(err);
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
