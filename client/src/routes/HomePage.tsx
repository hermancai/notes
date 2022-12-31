import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import useSetUsername from "../hooks/useSetUsername";
import { getNotes, sortNoteList } from "../features/note/noteSlice";
import { SortModes } from "../types/UserInterfaces";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Skeleton } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import NoteCard from "../components/notes/NoteCard";
import SortDropdown from "../components/shared/SortDropdown";

function SkeletonNotes() {
  return (
    <>
      <Skeleton variant="rounded" height="2rem" />
      <Skeleton variant="text" width="4rem" sx={{ fontSize: "2rem" }} />
      <Skeleton variant="rounded" height="4rem" />
      <Skeleton variant="rounded" height="4rem" />
      <Skeleton variant="rounded" height="4rem" />
    </>
  );
}

export default function HomePage() {
  useSetUsername();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username, loading: userLoading } = useSelector(
    (state: RootState) => state.user
  );
  const {
    allNotes,
    loading: noteLoading,
    initialFetch,
    sortMode,
  } = useSelector((state: RootState) => state.note);

  React.useEffect(() => {
    const getAllNotes = async () => {
      try {
        // Only make one GET request to server
        if (username !== undefined && !initialFetch) {
          await dispatch(getNotes()).unwrap();
        }
      } catch (err) {
        navigate("/login");
      }
    };

    getAllNotes();
  }, [navigate, dispatch, initialFetch, username]);

  const handleClickNewNote = () => {
    navigate("/notes/new");
  };

  const handleSortList = (sortMode: SortModes["sortMode"]) => {
    dispatch(sortNoteList(sortMode));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {noteLoading || userLoading ? (
        <SkeletonNotes />
      ) : (
        <>
          <Button
            variant="contained"
            onClick={handleClickNewNote}
            sx={{ color: "white" }}
          >
            <AddRounded />
            New Note
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
              {allNotes.length === 0
                ? "Notes (0)"
                : `Notes (${allNotes.length}):`}
            </Typography>
            {allNotes.length < 2 ? null : (
              <SortDropdown
                sortMode={sortMode}
                handleSortList={handleSortList}
              />
            )}
          </Box>
          {allNotes.map((note) => {
            return <NoteCard note={note} key={note.id} />;
          })}
        </>
      )}
    </Box>
  );
}
