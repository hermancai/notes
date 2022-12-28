import { Response, Request, NextFunction } from "express";
import Note from "../models/Note";
import { UpdateNoteRequest, Note as NotePayload } from "shared";

// @desc   Create new note from user
// @route  POST /api/note
const createNewNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, text } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Error: Missing note title" });
  }

  // Add new note to database
  const newNote = await Note.create(
    { title, text, userId: req.userId },
    { returning: true }
  );
  if (!newNote) {
    return res.status(500).json({ message: "Error: Create note failed" });
  }

  const note: NotePayload = {
    id: newNote.id,
    userId: newNote.userId,
    title: newNote.title,
    text: newNote.text,
    createdAt: newNote.createdAt,
    updatedAt: newNote.updatedAt,
  };

  res.status(200).json({ note });
};

// @desc   Get all notes belonging to user
// @route  GET /api/note
const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  const notes = await Note.findAll({
    where: { userId: req.userId },
    order: [["updatedAt", "DESC"]],
  });

  if (notes === null) {
    return res.status(500).json({ message: "Error: Get notes failed" });
  }

  res.status(200).json({ notes });
};

// @desc   Update an existing note
// @route  PUT /api/note
const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  if (!userId) {
    return res.status(400).json({ message: "Error: Missing user ID" });
  }

  const { id, title, text }: UpdateNoteRequest = req.body;
  if (!id || !title) {
    return res.status(400).json({ message: "Error: Missing note details" });
  }

  try {
    const updatedNote = await Note.update(
      { title, text },
      { where: { userId, id }, returning: true }
    );
    if (!updatedNote) {
      return res.status(400).json({ message: "Error: Note not found" });
    }

    const note = updatedNote[1][0];

    res.status(200).json({
      note: {
        title: note.title,
        text: note.text,
        updatedAt: note.updatedAt,
        id: note.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete an existing note
// @route  DELETE /api/note
const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;
  if (!userId) {
    return res.status(400).json({ message: "Error: Missing user ID" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Error: Missing note ID" });
  }

  try {
    const deletedNote = await Note.destroy({ where: { userId, id } });
    if (deletedNote === 0) {
      return res.status(400).json({ message: "Error: Note does not exist" });
    }
    return res.status(200).json({ message: "Success: Note deleted" });
  } catch (err) {
    next(err);
  }
};

export { createNewNote, getNotes, updateNote, deleteNote };
