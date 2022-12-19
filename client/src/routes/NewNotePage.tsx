import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import useSetUsername from "../hooks/useSetUsername";
import { createNewNote, sortNoteList } from "../features/note/noteSlice";
import { makeToast } from "../features/toast/toastSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { NewNotePayload } from "../interfaces/NoteInterfaces";

export default function NewNotePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { sortMode } = useSelector((state: RootState) => state.note);
  const [inputs, setInputs] = React.useState<NewNotePayload>({
    title: "",
    text: "",
  });

  useSetUsername();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createNewNote(inputs)).unwrap();
      dispatch(sortNoteList(sortMode));
      dispatch(makeToast("Created new note"));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Typography component="h1" variant="h4">
        New Note
      </Typography>
      <TextField
        label="Title"
        type="text"
        variant="outlined"
        name="title"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        required
        value={inputs.title}
      />
      <TextField
        label="Content"
        name="text"
        multiline
        minRows={4}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        value={inputs.text}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={inputs.title.trim() === ""}
        sx={{ color: "white" }}
      >
        Save
      </Button>
      <Button variant="outlined" color="error" onClick={() => navigate("/")}>
        Cancel
      </Button>
    </Box>
  );
}
