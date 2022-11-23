import React from "react";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { setNote } from "../features/note/noteSlice";
import { Note } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function EditNoteButton(props: { note: Note }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleEdit = (note: Note) => {
    dispatch(setNote(note));
    navigate("/notes/update");
  };

  return (
    <Button variant="text" onClick={() => handleEdit(props.note)}>
      EDIT
    </Button>
  );
}
