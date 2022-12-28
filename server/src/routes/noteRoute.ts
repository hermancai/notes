import { Router } from "express";
import verifyUser from "../middleware/verifyMiddleware";
import {
  createNewNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/noteController";

const router = Router();

router.get("/", verifyUser, getNotes);
router.post("/", verifyUser, createNewNote);
router.put("/", verifyUser, updateNote);
router.delete("/", verifyUser, deleteNote);

export default router;
