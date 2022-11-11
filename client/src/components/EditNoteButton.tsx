import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "../features/user/userSlice";
import { getNotes, setNote } from "../features/note/noteSlice";
import { Note } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

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
