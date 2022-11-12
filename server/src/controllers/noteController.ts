import { Response, Request, NextFunction } from "express";
import Note from "../models/Note";
import { NotePayload } from "../interfaces/interfaces";

// @desc   Create new note from user
// @route  POST /api/note
const createNewNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, text } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: "Missing title in new note" });
  }

  // Add new note to database
  const newNote = await Note.create({ title, text, userId: req.userId });
  if (!newNote) {
    return res
      .status(400)
      .json({ error: true, message: "Error occurred while creating new note" });
  }

  res.status(200).json({ error: false, message: "Note creation successful" });
};

// @desc   Get all notes belonging to user
// @route  GET /api/note
const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  const notes = await Note.findAll({
    where: { userId: req.userId },
    order: [["updatedAt", "DESC"]],
  });

  if (notes === null) {
    return res
      .status(400)
      .json({ error: true, message: "Error occurred while fetching notes" });
  }

  res.status(200).json({
    error: false,
    message: "Retrieved notes successfully",
    notes: notes,
  });
};

// @desc   Update an existing note
// @route  PUT /api/note
const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  if (!userId) {
    return res
      .status(400)
      .json({ error: true, message: "Update Error: Unknown user" });
  }

  const { id, title, text }: NotePayload = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ error: true, message: "Update Error: Note missing ID" });
  }

  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: "Update Error: Missing note title" });
  }

  try {
    const updatedNote = await Note.update(
      { title, text },
      { where: { userId, id } }
    );
    if (!updatedNote) {
      return res
        .status(400)
        .json({ error: true, message: "Update Error: Note not found" });
    }

    res
      .status(200)
      .json({ error: false, message: "Note updated successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete an existing note
// @route  DELETE /api/note
const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  if (!userId) {
    return res
      .status(400)
      .json({ error: true, message: "Delete Error: Unknown user" });
  }

  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ error: true, message: "Delete Error: Note missing ID" });
  }

  try {
    const deletedNote = await Note.destroy({ where: { userId, id } });
    if (deletedNote === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Delete Error: Note does not exist" });
    }
    return res
      .status(200)
      .json({ erro: false, message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export { createNewNote, getNotes, updateNote, deleteNote };
