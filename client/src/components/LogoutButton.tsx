import React from "react";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function LogoutButton() {
  const navigate = useNavigate();
  const loggedIn = useSelector((state: RootState) => state.user.loggedIn);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  };

  return loggedIn ? (
    <Button sx={{ marginLeft: "auto" }} variant="text" onClick={handleClick}>
      LOG OUT
    </Button>
  ) : null;
}
