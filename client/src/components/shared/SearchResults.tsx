import React from "react";
import { RootState, AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { getNotes } from "../../features/note/noteSlice";
import { getAllImages } from "../../features/image/imageSlice";
import Fuse from "fuse.js";
import { Box, Typography } from "@mui/material";
import NoteCard from "../notes/NoteCard";
import ImageCard from "../images/ImageCard";

export default function SearchResults() {
  const dispatch = useDispatch<AppDispatch>();

  const { searchQuery } = useSelector((state: RootState) => state.user);
  const {
    allNotes,
    initialFetch: noteInitialFetch,
    loading: noteLoading,
  } = useSelector((state: RootState) => state.note);
  const {
    allImages,
    initialFetch: imageInitialFetch,
    loading: imageLoading,
  } = useSelector((state: RootState) => state.image);

  const noteFuse = React.useMemo(
    () =>
      new Fuse(allNotes, {
        keys: ["title", "text"],
        threshold: 0.0,
        ignoreLocation: true,
      }),
    [allNotes]
  );

  const imageFuse = React.useMemo(
    () =>
      new Fuse(allImages, {
        keys: ["fileNameOriginal", "description"],
        threshold: 0.0,
        ignoreLocation: true,
      }),
    [allImages]
  );

  React.useEffect(() => {
    const fetchNotes = async () => {
      if (!noteInitialFetch) {
        await dispatch(getNotes()).unwrap();
      }
    };

    fetchNotes();
  }, [dispatch, noteInitialFetch]);

  React.useEffect(() => {
    const fetchImages = async () => {
      if (!imageInitialFetch) {
        await dispatch(getAllImages()).unwrap();
      }
    };

    fetchImages();
  }, [dispatch, imageInitialFetch]);

  const noteResults = noteFuse.search(searchQuery);
  const imageResults = imageFuse.search(searchQuery);

  return (
    <Box sx={{ display: "flex", gap: "1.5rem", flexDirection: "column" }}>
      {noteLoading ? (
        <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
          Loading notes...
        </Typography>
      ) : (
        <>
          <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
            {noteResults.length === 0
              ? "No matching notes..."
              : `Found Notes (${noteResults.length}):`}
          </Typography>
          {noteResults.map((entry) => (
            <NoteCard note={entry.item} key={entry.item.id} />
          ))}
        </>
      )}
      {imageLoading ? (
        <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
          Loading images...
        </Typography>
      ) : (
        <>
          <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
            {imageResults.length === 0
              ? "No matching images..."
              : `Found Images (${imageResults.length}):`}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {imageResults.map((entry) => (
              <ImageCard image={entry.item} key={entry.item.id} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
