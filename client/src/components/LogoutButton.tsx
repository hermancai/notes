import React from "react";
import type { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { ServerResponse } from "../interfaces/interfaces";
import { Button } from "@mui/material";

export default function LogoutButton() {
  const navigate = useNavigate();
  const loggedIn = useSelector((state: RootState) => state.user.loggedIn);
  const dispatch = useDispatch();

  const handleClick = async () => {
    const response = await fetch("/api/token", {
      method: "DELETE",
      credentials: "include",
    });
    const res = (await response.json()) as ServerResponse;
    if (res.error) {
      alert("Internal server error: logout failed");
      return console.log(res.message);
    }
    dispatch(resetUser());
    navigate("/login");
  };

  return loggedIn ? (
    <Button sx={{ marginLeft: "auto" }} variant="text" onClick={handleClick}>
      LOG OUT
    </Button>
  ) : null;
}
