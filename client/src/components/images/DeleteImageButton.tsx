import React from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { deleteImage } from "../../features/image/imageSlice";
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
import { PresignedImage } from "shared";

interface ButtonProps {
  imageKey: PresignedImage["fileName"];
}

export default function DeleteImageButton({ imageKey }: ButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState<boolean>(false);
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
      await dispatch(deleteImage(imageKey)).unwrap();
      handleClose();
      dispatch(makeToast("Deleted image"));
      navigate("/images");
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
            Delete this image?
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
