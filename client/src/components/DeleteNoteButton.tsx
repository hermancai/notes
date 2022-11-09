import React from "react";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import {
  resetNote,
  deleteNote,
  removeNoteFromList,
} from "../features/note/noteSlice";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DeleteNoteButton(props: { id: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await dispatch(deleteNote(props.id)).unwrap();
      dispatch(removeNoteFromList({ id: props.id }));
      dispatch(resetNote());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button variant="text" onClick={handleClick}>
      DELETE
    </Button>
  );
}
