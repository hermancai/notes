import { Router } from "express";
import verifyUser from "../middleware/verifyMiddleware";
import {
  getAllImages,
  getUploadPresignedURL,
  saveImage,
} from "../controllers/imageController";

const router = Router();

router.get("/", verifyUser, getAllImages);
router.post("/", verifyUser, saveImage);
router.post("/getUploadPresign", verifyUser, getUploadPresignedURL);

export default router;
