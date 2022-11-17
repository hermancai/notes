import React from "react";
import { Note } from "../interfaces/interfaces";
import DeleteNoteButton from "./DeleteNoteButton";
import EditNoteButton from "./EditNoteButton";
import {
  Box,
  Card,
  CardHeader,
  Collapse,
  IconButton,
  IconButtonProps,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { StickyNote2Outlined, ExpandMore } from "@mui/icons-material";
import LinkifyWrapper from "../components/LinkifyWrapper";

// HOC for delaying re-renders when tracking window size as state
const throttle = (func: () => void, delay: number) => {
  let inProgress = false;
  return () => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    func();
    setTimeout(() => {
      func();
      inProgress = false;
    }, delay);
  };
};

// Determines how many lines before a collapse is shown
const LINE_CLAMP = 4;
// Determines preview size of card content with collapse
const COLLAPSED_SIZE = "6em";

interface CardProps {
  note: Note;
}

interface ExpandWrapperProps extends IconButtonProps {
  expand: boolean;
}

// Icon wrapper rotates icon based on 'expand' boolean
const ExpandIconWrapper = styled((props: ExpandWrapperProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function NoteCard({ note }: CardProps) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [showCollapse, setShowCollapse] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState<number>(0);

  // Track window resize
  React.useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(window.innerWidth);
    }, 1000);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Collapse card content if it exceeds a line height
  React.useEffect(() => {
    if (ref.current !== null) {
      if (ref.current.getClientRects().length > LINE_CLAMP) {
        setShowCollapse(true);
      } else {
        setShowCollapse(false);
      }
    }
  }, [ref, windowWidth]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

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
            <StickyNote2Outlined color="primary" fontSize="small" />
            <LinkifyWrapper>{note.title}</LinkifyWrapper>
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
      <Box sx={{ padding: "0.5rem 1rem" }}>
        {showCollapse ? (
          <>
            <Collapse in={expanded} collapsedSize={COLLAPSED_SIZE}>
              <LinkifyWrapper>
                <p
                  ref={ref}
                  style={{ whiteSpace: "pre-wrap", display: "inline" }}
                >
                  {note.text}
                </p>
              </LinkifyWrapper>
            </Collapse>
            <Divider sx={{ margin: "0.5rem 0" }} />
            <Box
              sx={{ display: "flex", justifyContent: "end", width: "100%" }}
              onClick={toggleExpand}
            >
              <ExpandIconWrapper expand={expanded}>
                <ExpandMore />
              </ExpandIconWrapper>
            </Box>
          </>
        ) : (
          <LinkifyWrapper>
            <p ref={ref} style={{ whiteSpace: "pre-wrap", display: "inline" }}>
              {note.text}
            </p>
          </LinkifyWrapper>
        )}
      </Box>
    </Card>
  );
}
