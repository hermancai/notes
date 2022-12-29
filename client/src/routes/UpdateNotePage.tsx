import React from "react";
import { RootState, AppDispatch } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetNote,
  updateNote,
  sortNoteList,
} from "../features/note/noteSlice";
import { makeToast } from "../features/toast/toastSlice";
import { NewNoteRequest } from "../types/NoteInterfaces";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteNoteButton from "../components/notes/DeleteNoteButton";

export default function UpdateNotePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const { id, title, text, sortMode } = useSelector(
    (state: RootState) => state.note
  );

  React.useEffect(() => {
    if (id === undefined) {
      navigate("/");
    }
  }, [navigate, dispatch, id]);

  const [inputs, setInputs] = React.useState<NewNoteRequest>({
    title: title || "",
    text: text || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (id === undefined) {
      return navigate("/");
    }

    setLoading(true);
    try {
      await dispatch(updateNote({ ...inputs, id })).unwrap();
      dispatch(resetNote());
      dispatch(sortNoteList(sortMode));
      dispatch(makeToast("Updated note"));
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
        Edit Note
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
        spellCheck={false}
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
      <Box
        sx={{
          marginTop: "2rem",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DeleteNoteButton id={id!} />
      </Box>
    </Box>
  );
}
