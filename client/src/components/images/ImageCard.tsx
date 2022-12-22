import React from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { getFullImage, setImage } from "../../features/image/imageSlice";
import { setSearchQuery } from "../../features/user/userSlice";
import {
  Card,
  CardActions,
  CardMedia,
  Button,
  Modal,
  Box,
  Divider,
} from "@mui/material";
import { OpenInNewRounded } from "@mui/icons-material";
import { PresignedImage } from "../../interfaces/ImageInterfaces";
import DeleteImageButton from "../../components/images/DeleteImageButton";
import { useNavigate } from "react-router-dom";
import CollaspeCardContent from "../../components/shared/CollapseCardContent";
import HighlightedText from "../../components/shared/HighlightedText";

interface ImageCardProps {
  image: PresignedImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const ref = React.useRef<HTMLParagraphElement>(null);
  const [openModal, setOpenModal] = React.useState(false);

  // Derived state for handling aws 403 errors
  const [url, setUrl] = React.useState(image.presignedURL);
  const [loadCounter, setLoadCounter] = React.useState(0);

  const toggleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  // Get url for full image and open in new tab
  // Need to open empty tab immediately to count as trusted event
  // Some browsers (safari) block async pop-ups
  const openFullImage = async () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.location.href = await dispatch(
        getFullImage({
          fileName: image.fileName,
          fileNameOriginal: image.fileNameOriginal,
        })
      ).unwrap();
    }
  };

  // When loading url for new image, aws returns 403 error on first load
  const handleLoadError = () => {
    if (loadCounter < 4) {
      setUrl("");
      setTimeout(() => {
        setUrl(image.presignedURL);
      }, 2000);
      setLoadCounter(loadCounter + 1);
    }
  };

  const handleClickEdit = () => {
    dispatch(setImage(image));
    dispatch(setSearchQuery(""));
    navigate("/images/update");
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 300,
          flexGrow: 1,
          flexBasis: 0,
          backgroundColor: "action.hover",
          "&:hover": { borderColor: "text.secondary" },
        }}
      >
        <CardMedia
          component="img"
          alt="thumbnail"
          image={url}
          height={150}
          sx={{
            minHeight: "150px",
            objectFit: "contain",
            backgroundColor: "background.default",
            borderBottom: "solid 1px",
            borderColor: "action.disabledBackground",
            "&:hover": { cursor: "zoom-in" },
          }}
          onClick={toggleOpenModal}
          onError={handleLoadError}
        />
        <Box sx={{ height: "100%" }}>
          <Box
            sx={{
              padding: "0.5rem 1rem",
              wordBreak: "break-word",
            }}
          >
            <HighlightedText text={image.fileNameOriginal} />
          </Box>

          {image.description === "" ? null : (
            <>
              <Divider />
              <Box sx={{ padding: "0.5rem 1rem", height: "100%" }}>
                <CollaspeCardContent textRef={ref} text={image.description} />
              </Box>
            </>
          )}
        </Box>

        <CardActions
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "space-between" },
            flexDirection: { xs: "column", sm: "row" },
            gap: "0.5rem",
            borderTop: "solid 1px",
            borderColor: "action.disabledBackground",
          }}
        >
          <Button onClick={handleClickEdit}>Edit</Button>
          <Button
            color="info"
            sx={{
              display: "flex",
              gap: "0.25rem",
            }}
            onClick={openFullImage}
          >
            Full Size
            <OpenInNewRounded fontSize="small" />
          </Button>
          <DeleteImageButton imageKey={image.fileName} />
        </CardActions>
      </Card>
      <Modal
        open={openModal}
        onClose={toggleOpenModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          objectFit: "contain",
        }}
      >
        <Box
          component="img"
          onClick={toggleOpenModal}
          sx={{
            "&:hover": { cursor: "zoom-out" },
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
          }}
          alt="fullscreen thumbnail"
          src={image.presignedURL}
        />
      </Modal>
    </>
  );
}
