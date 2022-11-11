import React from "react";
import { Button, alpha } from "@mui/material";
import { green } from "@mui/material/colors";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

export default function SidebarLink({ children, onClick, isActive }: Props) {
  return (
    <Button
      onClick={onClick}
      sx={{
        display: "flex",
        justifyContent: "start",
        gap: "1rem",
        width: "100%",
        backgroundColor: isActive ? alpha(green[500], 0.1) : null,
        color: isActive ? "primary.light" : "text.primary",
        "&:hover": {
          color: "primary.light",
          backgroundColor: isActive
            ? alpha(green[500], 0.2)
            : alpha(green[500], 0.1),
        },
      }}
    >
      {children}
    </Button>
  );
}
