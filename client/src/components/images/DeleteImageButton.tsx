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
import { useNavigate } from "react-router-dom";
import { ImageInterfaces } from "../../interfaces/ImageInterfaces";

interface ButtonProps {
  imageKey: ImageInterfaces.ImageWithPresignedURL["fileName"];
}

export default function DeleteImageButton({ imageKey }: ButtonProps) {
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
      await dispatch(deleteImage(imageKey)).unwrap();
      handleClose();
      dispatch(makeToast("Deleted image"));
      navigate("/images");
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
            Delete this image?
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
