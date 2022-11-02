import { Router } from "express";
import verifyUser from "../middleware/verifyMiddleware";
import {
  signUpUser,
  loginUser,
  deleteAccount,
} from "../controllers/userController";

const router = Router();

router.delete("/", verifyUser, deleteAccount);
router.post("/signup", signUpUser);
router.post("/login", loginUser);

export default router;
