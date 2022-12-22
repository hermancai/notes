import React from "react";
import { RootState, AppDispatch } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetActiveImage,
  updateImage,
  sortImageList,
} from "../features/image/imageSlice";
import { makeToast } from "../features/toast/toastSlice";
import { PresignedImage } from "../interfaces/ImageInterfaces";
import { Box, Button, TextField, Typography } from "@mui/material";
import DeleteImageButton from "../components/images/DeleteImageButton";
import ThumbnailModal from "../components/images/ThumbnailModal";

export default function UpdateNotePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = React.useState(false);
  const toggleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  const { activeImage, sortMode } = useSelector(
    (state: RootState) => state.image
  );

  React.useEffect(() => {
    if (activeImage === undefined) {
      navigate("/images");
    }
  }, [navigate, dispatch, activeImage]);

  const [description, setDescription] = React.useState<
    PresignedImage["description"] | undefined
  >(activeImage?.description);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  if (activeImage === undefined) return null;

  const handleSubmit = async () => {
    if (description === undefined) {
      return navigate("/images");
    }

    try {
      await dispatch(
        updateImage({ description, fileName: activeImage.fileName })
      ).unwrap();
      dispatch(resetActiveImage());
      dispatch(sortImageList(sortMode));
      dispatch(makeToast("Updated image"));
      navigate("/images");
    } catch (error) {
      const err = error as Error;
      dispatch(makeToast(err.message));
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Typography component="h1" variant="h4">
          Edit Image Description
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={activeImage.presignedURL}
            sx={{
              height: 300,
              "&:hover": { cursor: "zoom-in" },
            }}
            onClick={toggleOpenModal}
          />
        </Box>

        <TextField
          label="Image"
          type="text"
          variant="outlined"
          name="fileName"
          spellCheck={false}
          disabled
          InputLabelProps={{ shrink: true }}
          value={activeImage.fileNameOriginal}
        />
        <TextField
          label="Description"
          type="text"
          variant="outlined"
          name="description"
          multiline
          minRows={4}
          spellCheck={false}
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          value={description}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ color: "white" }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate("/images")}
        >
          Cancel
        </Button>
        <Box
          sx={{
            marginTop: "2rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DeleteImageButton imageKey={activeImage.fileName} />
        </Box>
      </Box>
      <ThumbnailModal
        open={openModal}
        toggleOpen={toggleOpenModal}
        url={activeImage.presignedURL}
      />
    </>
  );
}
