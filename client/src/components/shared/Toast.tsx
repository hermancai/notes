import React from "react";
import { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import {
  setOpen,
  clearCurrentToast,
  showNextToast,
} from "../../features/toast/toastSlice";
import { Snackbar, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function Toast() {
  const dispatch = useDispatch();
  const { toastList, currentToast, open } = useSelector(
    (state: RootState) => state.toast
  );

  React.useEffect(() => {
    if (toastList.length && !currentToast) {
      // If more toasts in list and no active toast, show next toast
      dispatch(showNextToast());
    } else if (toastList.length && currentToast && open) {
      // Close active toast if new toast is added
      dispatch(setOpen(false));
    }
  }, [toastList, currentToast, open, dispatch]);

  const handleClose = (e: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setOpen(false));
  };

  return (
    <Snackbar
      key={currentToast ? currentToast.key : undefined}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      TransitionProps={{ onExited: () => dispatch(clearCurrentToast()) }}
      message={currentToast ? currentToast.message : undefined}
      action={
        <IconButton
          aria-label="close"
          sx={{ padding: "0.5rem" }}
          color="inherit"
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      }
    />
  );
}
