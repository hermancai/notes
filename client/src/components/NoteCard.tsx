import React from "react";
import { Note } from "../interfaces/interfaces";
import DeleteNoteButton from "./DeleteNoteButton";
import EditNoteButton from "./EditNoteButton";
import { Box, Card, Button, CardHeader } from "@mui/material";
import { StickyNote2Outlined as NoteIcon } from "@mui/icons-material";

interface CardProps {
  note: Note;
}

export default function NoteCard({ note }: CardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ "&:hover": { borderColor: "text.secondary" } }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              overflowWrap: "anywhere",
            }}
          >
            <NoteIcon color="primary" fontSize="small" />
            {note.title}
          </Box>
        }
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              marginRight: "0.25rem",
              gap: "0.25rem",
            }}
          >
            <EditNoteButton note={note} />
            <DeleteNoteButton id={note.id} />
          </Box>
        }
        sx={{ backgroundColor: "action.hover", padding: "0.5rem" }}
        titleTypographyProps={{ fontSize: 16 }}
      />
      <Box sx={{ padding: "0.5rem", whiteSpace: "pre-wrap" }}>{note.text}</Box>
    </Card>
  );
}
