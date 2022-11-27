import React from "react";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import Fuse from "fuse.js";
import { Box, Typography } from "@mui/material";
import NoteCard from "../notes/NoteCard";

export default function SearchResults() {
  const { searchQuery } = useSelector((state: RootState) => state.user);
  const { allNotes } = useSelector((state: RootState) => state.note);

  const fuse = React.useMemo(
    () =>
      new Fuse(allNotes, {
        keys: ["title", "text"],
        threshold: 0.0,
        ignoreLocation: true,
      }),
    [allNotes]
  );
  const results = fuse.search(searchQuery);

  return (
    <>
      <Box sx={{ display: "flex", gap: "1.5rem", flexDirection: "column" }}>
        <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
          {results.length === 0
            ? "No matching notes..."
            : `Found Notes (${results.length}):`}
        </Typography>
        {results.map((note) => (
          <NoteCard note={note.item} key={note.item.id} />
        ))}
      </Box>
    </>
  );
}
