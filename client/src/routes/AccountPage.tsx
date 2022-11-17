import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { deleteAccount, verifyAccessToken } from "../features/user/userSlice";
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const verifyUser = async () => {
      try {
        await dispatch(verifyAccessToken()).unwrap();
      } catch (err) {
        navigate("/login");
      }
    };
    verifyUser();
  }, [dispatch, navigate]);

  const handleDeleteAccount = async () => {
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
          <DialogActions
            sx={{
              justifyContent: "space-between",
              minWidth: { sm: "400px" },
              padding: "0 1rem 1rem 1rem",
              gap: "2rem",
            }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              sx={{ margin: "0" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}
