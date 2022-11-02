import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { deleteAccount, refreshAccessToken } from "../features/user/userSlice";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username } = useSelector((state: RootState) => state.user);

  const handleClick = async () => {
    const initialRes = await dispatch(deleteAccount()).unwrap();
    if (initialRes.error) {
      if (initialRes.status === 401) {
        await dispatch(refreshAccessToken());
        const retryRes = await dispatch(deleteAccount()).unwrap();
        if (!retryRes.error) {
          return navigate("/login");
        }
        return alert(retryRes.message);
      }
      return alert(initialRes.message);
    }
    navigate("/login");
  };

  return (
    <Box>
      <p>Username: {username}</p>
      <Button variant="contained" onClick={handleClick}>
        Delete Account
      </Button>
    </Box>
  );
}
