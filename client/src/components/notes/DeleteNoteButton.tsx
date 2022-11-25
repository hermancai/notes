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
import { useNavigate } from "react-router-dom";

export default function DeleteNoteButton(props: { id: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteNote(props.id)).unwrap();
      dispatch(resetNote());
      handleClose();
      dispatch(makeToast("Deleted note"));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Button variant="text" onClick={handleOpen} color="error">
        DELETE
      </Button>
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
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
