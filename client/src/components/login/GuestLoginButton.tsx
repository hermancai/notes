import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { login } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function GuestLoginButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.user.loading);

  // Login with guest account
  const handleLogin = async () => {
    try {
      const res = await dispatch(
        login({ username: "Guest", password: "password" })
      ).unwrap();
      if (!res.error) {
        navigate("/");
      }
    } catch (err) {
      console.log("An error occurred while logging in:\n", err);
    }
  };

  return (
    <Button variant="text" onClick={handleLogin} disabled={loading}>
      LOGIN AS GUEST
    </Button>
  );
}
