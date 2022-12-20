import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { deleteAccount } from "../features/user/userSlice";
import useSetUsername from "../hooks/useSetUsername";
import { resetAllNotes } from "../features/note/noteSlice";
import { resetAllImages } from "../features/image/imageSlice";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = React.useState<boolean>(false);

  useSetUsername();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount()).unwrap();
      dispatch(resetAllNotes());
      dispatch(resetAllImages());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <p>Username: {username}</p>
      <div>
        <Button
          variant="contained"
          onClick={handleOpen}
          disabled={!username || username === "Guest"}
          color="error"
        >
          Delete Account
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-describedby="delete-confirm-description"
        >
          <DialogContent sx={{ padding: "1rem" }}>
            <DialogContentText id="delete-confirm-description">
              Permanently delete this account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}
