import React from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { setNote } from "../../features/note/noteSlice";
import { NoteInterfaces } from "../../interfaces/NoteInterfaces";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function EditNoteButton(props: { note: NoteInterfaces.Note }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleEdit = (note: NoteInterfaces.Note) => {
    dispatch(setNote(note));
    navigate("/notes/update");
  };

  return (
    <Button variant="text" onClick={() => handleEdit(props.note)}>
      EDIT
    </Button>
  );
}