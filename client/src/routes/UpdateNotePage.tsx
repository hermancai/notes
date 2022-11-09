import React from "react";
import { RootState, AppDispatch } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetNote, updateNote } from "../features/note/noteSlice";
import { NewNotePayload } from "../interfaces/interfaces";
import { Box, Button, TextField } from "@mui/material";
import DeleteNoteButton from "../components/DeleteNoteButton";

export default function UpdateNotePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { id, title, text } = useSelector((state: RootState) => state.note);

  React.useEffect(() => {
    if (id === undefined) {
      navigate("/");
    }
  }, [navigate, dispatch, id]);

  const [inputs, setInputs] = React.useState<NewNotePayload>({
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
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <p>new note page</p>
      <TextField
        label="Title"
        type="text"
        variant="standard"
        name="title"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        required
        value={inputs.title}
      />
      <TextField
        label="Text"
        name="text"
        multiline
        minRows={4}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        value={inputs.text}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={inputs.title.trim() === ""}
      >
        Save
      </Button>
      <Button variant="contained" onClick={() => navigate("/")}>
        Cancel
      </Button>
      <DeleteNoteButton id={id!} />
    </Box>
  );
}
