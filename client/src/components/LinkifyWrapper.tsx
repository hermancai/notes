import Linkify from "react-linkify";
import { useTheme } from "@mui/material/styles";

export default function LinkifyWrapper(props: { content: string }) {
  const theme = useTheme();

  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={decoratedHref}
            key={key}
            style={{ color: theme.palette.secondary.main }}
          >
            {decoratedText}
          </a>
        );
      }}
    >
      {props.content}
    </Linkify>
  );
}
