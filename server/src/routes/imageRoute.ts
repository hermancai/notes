import { Router } from "express";
import verifyUser from "../middleware/verifyMiddleware";
import {
  getAllImages,
  getUploadPresignedURL,
  saveImage,
  getFullImageURL,
} from "../controllers/imageController";

const router = Router();

router.get("/", verifyUser, getAllImages);
router.post("/", verifyUser, saveImage);
router.post("/getUploadPresign", verifyUser, getUploadPresignedURL);
router.post("/full", verifyUser, getFullImageURL);

export default router;
