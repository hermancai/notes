import React from "react";
import LoginPanel from "../components/LoginPanel";
import SignupPanel from "../components/SignupPanel";
import ColorModeToggle from "../components/ColorModeToggle";
import { Box } from "@mui/material";

export default function LoginPage() {
  const [showLogin, setShowLogin] = React.useState(true);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          padding: "0.5rem",
        }}
      >
        <ColorModeToggle />
      </Box>

      {showLogin ? (
        <LoginPanel setShowLogin={setShowLogin} />
      ) : (
        <SignupPanel setShowLogin={setShowLogin} />
      )}
    </>
  );
}
