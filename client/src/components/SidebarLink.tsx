import React from "react";
import { Box, Button } from "@mui/material";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export default function SidebarLink({ children, onClick }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0 0.5rem",
        border: "solid 1px black",
        color: "theme",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
