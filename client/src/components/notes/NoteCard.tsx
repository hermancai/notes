import React from "react";
import { Note } from "../../interfaces/NoteInterfaces";
import DeleteNoteButton from "./DeleteNoteButton";
import EditNoteButton from "./UpdateNoteButton";
import { Box, Card, CardHeader } from "@mui/material";
import { StickyNote2Outlined } from "@mui/icons-material";
import CollapseCardContent from "../shared/CollapseCardContent";
import HighlighedText from "../shared/HighlightedText";

interface CardProps {
  note: Note;
}

export default function NoteCard({ note }: CardProps) {
  const textRef = React.useRef<HTMLParagraphElement>(null);

  return (
    <Card
      variant="outlined"
      sx={{
        "&:hover": { borderColor: "text.secondary" },
      }}
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
            <StickyNote2Outlined color="primary" fontSize="small" />
            <p
              ref={textRef}
              style={{
                whiteSpace: "pre-wrap",
                margin: 0,
                display: "inline",
              }}
            >
              <HighlighedText text={note.title} />{" "}
            </p>
          </Box>
        }
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              marginRight: "0.25rem",
              gap: "0.5rem",
            }}
          >
            <EditNoteButton note={note} />
            <DeleteNoteButton id={note.id} />
          </Box>
        }
        sx={{ backgroundColor: "action.hover", padding: "0.5rem" }}
        titleTypographyProps={{ fontSize: 16 }}
      />
      <Box sx={{ padding: "0.5rem 1rem" }}>
        <CollapseCardContent textRef={textRef} text={note.text} />
      </Box>
    </Card>
  );
}
