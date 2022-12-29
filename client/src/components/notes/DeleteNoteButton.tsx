import React from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { resetNote, deleteNote } from "../../features/note/noteSlice";
import { makeToast } from "../../features/toast/toastSlice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { Note } from "../../types/NoteInterfaces";

interface ButtonProps {
  id: Note["id"];
}

export default function DeleteNoteButton({ id }: ButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteNote(id)).unwrap();
      dispatch(resetNote());
      handleClose();
      dispatch(makeToast("Deleted note"));
      navigate("/");
    } catch (error) {
      const err = error as Error;
      dispatch(makeToast(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoadingButton
        variant="text"
        onClick={handleOpen}
        color="error"
        loading={loading}
        disabled={loading}
      >
        DELETE
      </LoadingButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-describedby="delete-confirm-description"
      >
        <DialogContent sx={{ padding: "1rem" }}>
          <DialogContentText id="delete-confirm-description">
            Delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDelete}
            loading={loading}
            disabled={loading}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
