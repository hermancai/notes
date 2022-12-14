import React from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../features/user/userSlice";
import { Button, alpha } from "@mui/material";
import { green } from "@mui/material/colors";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

export default function SidebarLink({ children, onClick, isActive }: Props) {
  const dispatch = useDispatch();

  const handleClick = () => {
    // Clear search bar to remove search results overlay
    dispatch(setSearchQuery(""));
    onClick();
  };

  return (
    <Button
      onClick={handleClick}
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
        border: isActive ? "1px solid" : null,
        borderColor: isActive ? alpha(green[500], 0.5) : null,
      }}
    >
      {children}
    </Button>
  );
}
