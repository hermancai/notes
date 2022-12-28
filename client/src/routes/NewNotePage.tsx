import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import useSetUsername from "../hooks/useSetUsername";
import { createNewNote, sortNoteList } from "../features/note/noteSlice";
import { makeToast } from "../features/toast/toastSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { NewNoteRequest } from "shared";

export default function NewNotePage() {
  useSetUsername();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { sortMode } = useSelector((state: RootState) => state.note);
  const [loading, setLoading] = React.useState(false);
  const [inputs, setInputs] = React.useState<NewNoteRequest>({
    title: "",
    text: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(createNewNote(inputs)).unwrap();
      dispatch(sortNoteList(sortMode));
      dispatch(makeToast("Created new note"));
      navigate("/");
    } catch (error) {
      const err = error as Error;
      dispatch(makeToast(err.message));
    } finally {
      setLoading(false);
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
      <LoadingButton
        variant="contained"
        onClick={handleSubmit}
        disabled={loading || inputs.title.trim() === ""}
        sx={{
          color: "white",
          "& .MuiCircularProgress-root": { color: "success.main" },
        }}
        loading={loading}
      >
        Save
      </LoadingButton>
      <Button variant="outlined" color="error" onClick={() => navigate("/")}>
        Cancel
      </Button>
    </Box>
  );
}
