import React from "react";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { verifyAccessToken } from "../features/user/userSlice";
import { createNewNote } from "../features/note/noteSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { NewNotePayload } from "../interfaces/interfaces";

export default function NewNotePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [inputs, setInputs] = React.useState<NewNotePayload>({
    title: "",
    text: "",
  });

  React.useEffect(() => {
    const verifyUser = async () => {
      try {
        await dispatch(verifyAccessToken());
      } catch (err) {
        navigate("/login");
      }
    };
    verifyUser();
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createNewNote(inputs)).unwrap();
      navigate("/");
    } catch (err) {
      alert(err);
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
      />
      <TextField
        label="Text"
        name="text"
        multiline
        minRows={4}
        variant="standard"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
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
    </Box>
  );
}
