import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "../features/user/userSlice";
import { getNotes } from "../features/note/noteSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import NoteCard from "../components/NoteCard";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { allNotes } = useSelector((state: RootState) => state.note);

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <>
        <Button
          variant="contained"
          onClick={() => navigate("/notes/new")}
          sx={{ color: "white" }}
        >
          <Add />
          New Note
        </Button>
        {allNotes.length === 0 ? (
          <p>No notes</p>
        ) : (
          allNotes.map((note) => {
            return <NoteCard note={note} key={note.id} />;
          })
        )}
      </>
    </Box>
  );
}
