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
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { makeToast } from "../features/toast/toastSlice";

export default function AccountPage() {
  useSetUsername();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await dispatch(deleteAccount()).unwrap();
      dispatch(resetAllNotes());
      dispatch(resetAllImages());
      navigate("/login");
    } catch (error) {
      const err = error as Error;
      dispatch(makeToast(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <p>Username: {username}</p>
      <div>
        <LoadingButton
          variant="contained"
          onClick={handleOpen}
          disabled={!username || loading || username === "Guest"}
          loading={loading}
          color="error"
        >
          Delete Account
        </LoadingButton>
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
            <LoadingButton
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              loading={loading}
              disabled={loading}
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}
