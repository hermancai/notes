import React from "react";
import { Collapse, Divider, Button, Box } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import debounce from "lodash.debounce";
import HighlightedText from "./HighlightedText";

// Determines how many lines before a collapse is shown
const LINE_CLAMP = 4;
// Determines preview size of card content with collapse
const COLLAPSED_SIZE = "6em";

interface TextProps {
  textRef: React.RefObject<HTMLParagraphElement>;
  text: string;
}

function ParagraphWrapper({ textRef, text }: TextProps) {
  return (
    <Box sx={{ wordBreak: "break-word" }}>
      <p
        ref={textRef}
        style={{
          whiteSpace: "pre-wrap",
          margin: 0,
          display: "inline",
        }}
      >
        <HighlightedText text={text} />
      </p>
    </Box>
  );
}

export default function CollapseCardContent({ textRef, text }: TextProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [showCollapse, setShowCollapse] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState<number>(0);

  // For hiding flash of uncollapsed note while waiting for ref
  const [loading, setLoading] = React.useState(true);

  // Track window resize
  React.useEffect(() => {
    const debouncedWindowResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 500);

    window.addEventListener("resize", debouncedWindowResize);
    return () => window.removeEventListener("resize", debouncedWindowResize);
  }, []);

  // Collapse card content if it exceeds a line height
  React.useEffect(() => {
    if (textRef.current !== null) {
      if (textRef.current.getClientRects().length > LINE_CLAMP) {
        setShowCollapse(true);
      } else {
        setShowCollapse(false);
      }
      setLoading(false);
    }
  }, [textRef, windowWidth]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (!showCollapse) return <ParagraphWrapper text={text} textRef={textRef} />;

  return (
    <>
      <Collapse
        in={expanded}
        collapsedSize={COLLAPSED_SIZE}
        sx={{
          visibility: loading ? "hidden" : "visible",
        }}
      >
        <ParagraphWrapper text={text} textRef={textRef} />
      </Collapse>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <Button
        onClick={toggleExpand}
        variant="text"
        size="small"
        sx={{
          display: "flex",
          marginLeft: "auto",
          whiteSpace: "nowrap",
          textTransform: "none",
          paddingLeft: "0.75rem",
        }}
      >
        {expanded ? "Show Less" : "Show More"}
        <ExpandMore
          color="primary"
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "transform",
            transitionDuration: "0.5s",
          }}
        />
      </Button>
    </>
  );
}
