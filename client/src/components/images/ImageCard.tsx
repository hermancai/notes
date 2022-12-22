import React from "react";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { getFullImage, setImage } from "../../features/image/imageSlice";
import { setSearchQuery } from "../../features/user/userSlice";
import {
  Card,
  CardActions,
  Button,
  Modal,
  Box,
  Divider,
  Skeleton,
} from "@mui/material";
import { OpenInNewRounded } from "@mui/icons-material";
import { PresignedImage } from "../../interfaces/ImageInterfaces";
import DeleteImageButton from "../../components/images/DeleteImageButton";
import { useNavigate } from "react-router-dom";
import CollaspeCardContent from "../../components/shared/CollapseCardContent";
import HighlightedText from "../../components/shared/HighlightedText";
import ThumbnailModal from "../images/ThumbnailModal";

interface ImageCardProps {
  image: PresignedImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const ref = React.useRef<HTMLParagraphElement>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

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

  // When loading thumbnail for new image, S3 returns 403 error on first load
  const handleLoadError = () => {
    if (loadCounter < 4) {
      setUrl("");
      setTimeout(() => {
        setUrl(image.presignedURL);
      }, 2000);
      setLoadCounter(loadCounter + 1);
    } else {
      setLoading(false);
    }
  };

  const handleOnLoad = () => {
    setLoading(false);
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
        <Box
          sx={{
            height: "150px",
            backgroundColor: "background.default",
            borderBottom: "solid 1px",
            borderColor: "action.disabledBackground",
            position: "relative",
          }}
        >
          <Skeleton
            variant="rectangular"
            height="100%"
            width="100%"
            sx={{ position: "absolute", display: loading ? "block" : "none" }}
          />
          <Box
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              visibility: loading ? "hidden" : "visible",
              "&:hover": { cursor: "zoom-in" },
            }}
            src={url}
            onLoad={handleOnLoad}
            onError={handleLoadError}
            onClick={toggleOpenModal}
          />
        </Box>
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
      <ThumbnailModal
        open={openModal}
        toggleOpen={toggleOpenModal}
        url={image.presignedURL}
      />
    </>
  );
}
