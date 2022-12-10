import React from "react";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { uploadImage } from "../features/image/imageSlice";
import useSetUsername from "../hooks/useSetUsername";
import { makeToast } from "../features/toast/toastSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  Input,
} from "@mui/material";
import { ImageInterfaces } from "../interfaces/ImageInterfaces";

export default function NewImagePage() {
  useSetUsername();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fileInputRef = React.useRef<HTMLInputElement>();
  const [inputs, setInputs] = React.useState<ImageInterfaces.NewImagePayload>({
    file: undefined,
    description: "",
  });

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, description: e.target.value });
  };

  const clickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      file: e.target.files !== null ? e.target.files[0] : undefined,
    });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(uploadImage(inputs)).unwrap();
      // TODO dispatch(sortNoteList(sortMode));
      dispatch(makeToast("Saved new image"));
      navigate("/images");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickCancel = () => {
    navigate("/images");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Typography component="h1" variant="h4">
        New Image
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <InputLabel sx={{ flexShrink: "0" }}>
          <Input
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: ".jpg,.jpeg,.png" }}
            sx={{ display: "none" }}
            ref={fileInputRef}
          />
          <Button
            variant="contained"
            onClick={clickFileInput}
            sx={{ color: "white" }}
          >
            Choose Image
          </Button>
        </InputLabel>
        <Typography variant="body1">
          {inputs.file ? inputs.file.name : "No file chosen"}
        </Typography>
      </Box>
      <TextField
        label="Description"
        type="text"
        variant="outlined"
        name="title"
        multiline
        minRows={4}
        InputLabelProps={{ shrink: true }}
        onChange={handleDescriptionChange}
        value={inputs.description}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={inputs.file === undefined}
        sx={{ color: "white" }}
      >
        Save
      </Button>
      <Button variant="outlined" color="error" onClick={handleClickCancel}>
        Cancel
      </Button>
    </Box>
  );
}
