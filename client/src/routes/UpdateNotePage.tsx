import React from "react";
import { RootState, AppDispatch } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetNote,
  updateNote,
  sortNoteList,
} from "../features/note/noteSlice";
import { NoteInterfaces } from "../interfaces/NoteInterfaces";
import { Box, Button, TextField, Typography } from "@mui/material";
import DeleteNoteButton from "../components/notes/DeleteNoteButton";

export default function UpdateNotePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { id, title, text, sortMode } = useSelector(
    (state: RootState) => state.note
  );

  React.useEffect(() => {
    if (id === undefined) {
      navigate("/");
    }
  }, [navigate, dispatch, id]);

  const [inputs, setInputs] = React.useState<NoteInterfaces.NewNotePayload>({
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

    try {
      await dispatch(updateNote({ ...inputs, id })).unwrap();
      dispatch(resetNote());
      dispatch(sortNoteList(sortMode));
      navigate("/");
    } catch (err) {
      console.log(err);
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
