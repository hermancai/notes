import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "../features/user/userSlice";
import { getNotes, setNote } from "../features/note/noteSlice";
import { Note } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider } from "@mui/material";
import DeleteNoteButton from "../components/DeleteNoteButton";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { allNotes, loading } = useSelector((state: RootState) => state.note);

  React.useEffect(() => {
    const getAllNotes = async () => {
      try {
        await dispatch(getNotes()).unwrap();
        dispatch(setUsername());
      } catch (err) {
        navigate("/login");
      }
    };

    getAllNotes();
  }, [navigate, dispatch]);

  const handleEdit = (note: Note) => {
    dispatch(setNote(note));
    navigate("/notes/update");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <>
        <Button variant="contained" onClick={() => navigate("/notes/new")}>
          New Note
        </Button>
        {allNotes.length === 0 ? (
          <p>No notes</p>
        ) : (
          allNotes.map((note) => {
            return (
              <Box key={note.id}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Title: {note.title}</p>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="text" onClick={() => handleEdit(note)}>
                      EDIT
                    </Button>
                    <DeleteNoteButton id={note.id} />
                  </Box>
                </Box>
                <p>Text: {note.text}</p>
              </Box>
            );
          })
        )}
      </>
    </Box>
  );
}
