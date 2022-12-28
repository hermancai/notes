import { Router } from "express";
import {
  refreshAccessToken,
  verifyToken,
  deleteToken,
} from "../controllers/tokenController";

const router = Router();

router.route("/").post(verifyToken).put(refreshAccessToken).delete(deleteToken);

export default router;
