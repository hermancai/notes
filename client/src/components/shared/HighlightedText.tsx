import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import LinkifyWrapper from "./LinkifyWrapper";
import escapeRegExp from "lodash.escaperegexp";
import { green } from "@mui/material/colors";

interface TextProps {
  children?: React.ReactNode;
  text: string;
}

export default function HighlightedText({ text }: TextProps) {
  const { searchQuery } = useSelector((state: RootState) => state.user);

  // Text will be linkified if there is no search query
  if (!searchQuery.trim()) return <LinkifyWrapper>{text}</LinkifyWrapper>;

  // gi = global, match all instances, case-insensitive
  const parts = text.split(new RegExp(`(${escapeRegExp(searchQuery)})`, "gi"));

  return (
    <span>
      {parts.map((part, i) => {
        return (
          <span
            key={i}
            style={part === searchQuery ? { backgroundColor: green[500] } : {}}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}
