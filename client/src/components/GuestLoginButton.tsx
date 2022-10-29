import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { ServerResponse } from "../interfaces/interfaces";
import { Button } from "@mui/material";

export default function GuestLoginButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({ username: "Guest", password: "password" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await response.json()) as ServerResponse;
    if (res.error) {
      return console.log("Guest Login Error: ", res.message);
    }

    dispatch(
      setUser({ username: res.username!, accessToken: res.accessToken! })
    );
    return navigate("/home");
  };

  return (
    <Button variant="text" onClick={handleLogin}>
      LOGIN AS GUEST
    </Button>
  );
}
