import React from "react";
import {
  Box,
  Collapse,
  IconButton,
  IconButtonProps,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ExpandMore } from "@mui/icons-material";
import LinkifyWrapper from "../../components/shared/LinkifyWrapper";
import throttle from "../../util/throttle";

// Determines how many lines before a collapse is shown
const LINE_CLAMP = 4;
// Determines preview size of card content with collapse
const COLLAPSED_SIZE = "6em";

interface TextProps {
  textRef: React.RefObject<HTMLParagraphElement>;
  text: string;
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

function ParagraphWrapper({ textRef, text }: TextProps) {
  return (
    <LinkifyWrapper>
      <p
        ref={textRef}
        style={{
          whiteSpace: "pre-wrap",
          margin: 0,
          display: "inline",
        }}
      >
        {text}
      </p>
    </LinkifyWrapper>
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
    const handleResize = throttle(() => {
      setWindowWidth(window.innerWidth);
    }, 1000);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      <Box
        sx={{ display: "flex", justifyContent: "end", width: "100%" }}
        onClick={toggleExpand}
      >
        <ExpandIconWrapper expand={expanded}>
          <ExpandMore />
        </ExpandIconWrapper>
      </Box>
    </>
  );
}
