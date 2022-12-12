import React from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { getFullImage } from "../../features/image/imageSlice";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import { OpenInNewRounded } from "@mui/icons-material";
import { ImageInterfaces } from "../../interfaces/ImageInterfaces";
import LinkifyWrapper from "../../components/shared/LinkifyWrapper";
import DeleteImageButton from "../../components/images/DeleteImageButton";

interface ImageCardProps {
  image: ImageInterfaces.ImageWithPresignedURL;
}

export default function ImageCard({ image }: ImageCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [openModal, setOpenModal] = React.useState(false);

  // Derived state for handling aws 403 errors
  const [url, setUrl] = React.useState(image.presignedURL);
  const [loadCounter, setLoadCounter] = React.useState(0);

  const toggleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  // Get url for full image and open in new tab
  const openFullImage = async () => {
    const fullImageURL = await dispatch(getFullImage(image.fileName)).unwrap();
    if (window !== null) {
      window.open(fullImageURL, "_blank", "noreferrer");
    }
  };

  // When loading url for new image, aws returns 403 error on first load
  const handleLoadError = () => {
    if (loadCounter < 3) {
      setUrl("");
      setTimeout(() => {
        setUrl(image.presignedURL);
      }, 1000);
      setLoadCounter(loadCounter + 1);
    }
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
            objectFit: "contain",
            backgroundColor: "background.default",
            borderBottom: "solid 1px",
            borderColor: "action.disabledBackground",
            "&:hover": { cursor: "zoom-in" },
          }}
          onClick={toggleOpenModal}
          onError={handleLoadError}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <LinkifyWrapper>
            {image.description === "" ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No description
              </Typography>
            ) : (
              <Typography variant="body2">{image.description}</Typography>
            )}
          </LinkifyWrapper>
        </CardContent>

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
          <Button size="small">Edit</Button>
          <Button
            size="small"
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
