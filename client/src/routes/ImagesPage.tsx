import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllImages } from "../features/image/imageSlice";
import { useNavigate } from "react-router-dom";
import useSetUsername from "../hooks/useSetUsername";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import ImageCard from "../components/images/ImageCard";

export default function ImagesPage() {
  useSetUsername();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username } = useSelector((state: RootState) => state.user);
  const { initialFetch, allImages } = useSelector(
    (state: RootState) => state.image
  );

  React.useEffect(() => {
    const getImages = async () => {
      try {
        // Only make one GET request to server
        if (username !== undefined && !initialFetch) {
          await dispatch(getAllImages()).unwrap();
        }
      } catch (err) {
        navigate("/login");
      }
    };

    getImages();
  }, [dispatch, navigate, initialFetch, username]);

  const handleClickNewImage = () => {
    navigate("/images/new");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Button
        variant="contained"
        onClick={handleClickNewImage}
        sx={{ color: "white" }}
      >
        <Add />
        New Image
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
          {allImages.length === 0
            ? "Images (0)"
            : `Images (${allImages.length}):`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {allImages.map((image) => {
          return <ImageCard key={image.id} image={image} />;
        })}
      </Box>
    </Box>
  );
}
