import { Modal, Box } from "@mui/material";

interface ModalProps {
  open: boolean;
  toggleOpen: () => void;
  url: string;
}

export default function ThumbnailModal({ open, toggleOpen, url }: ModalProps) {
  return (
    <Modal
      open={open}
      onClose={toggleOpen}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        component="img"
        onClick={toggleOpen}
        sx={{
          "&:hover": { cursor: "zoom-out" },
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
        alt="fullscreen thumbnail"
        src={url}
      />
    </Modal>
  );
}
