import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteAccount,
  setUsername,
  verifyAccessToken,
} from "../features/user/userSlice";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username } = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    const verifyUser = async () => {
      try {
        await dispatch(verifyAccessToken());
      } catch (err) {
        alert(err);
        navigate("/login");
      }
    };
    verifyUser();
  }, []);

  const handleClick = async () => {
    try {
      await dispatch(deleteAccount()).unwrap();
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Box>
      <p>Username: {username}</p>
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={!username || username === "Guest"}
      >
        Delete Account
      </Button>
    </Box>
  );
}
