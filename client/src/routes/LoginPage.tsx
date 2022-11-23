import React from "react";
import LoginPanel from "../components/LoginPanel";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { resetUser } from "../features/user/userSlice";
import SignupPanel from "../components/SignupPanel";
import ColorModeToggle from "../components/ColorModeToggle";
import { Box } from "@mui/material";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [showLogin, setShowLogin] = React.useState(true);

  React.useEffect(() => {
    dispatch(resetUser());
  }, [dispatch]);

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
