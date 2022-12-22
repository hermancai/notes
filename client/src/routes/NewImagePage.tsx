import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, sortImageList } from "../features/image/imageSlice";
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
import { NewImagePayload } from "../interfaces/ImageInterfaces";

function InfoText(props: { showError: boolean; children: React.ReactNode }) {
  return (
    <Typography
      variant="subtitle2"
      color={props.showError ? "error.light" : "text.secondary"}
    >
      {props.children}
    </Typography>
  );
}

export default function NewImagePage() {
  useSetUsername();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fileInputRef = React.useRef<HTMLInputElement>();
  const { sortMode, allImages } = useSelector(
    (state: RootState) => state.image
  );
  const [inputs, setInputs] = React.useState<NewImagePayload>({
    file: undefined,
    fileNameOriginal: "",
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
      fileNameOriginal: e.target.files !== null ? e.target.files[0].name : "",
    });
  };

  const handleSubmit = async () => {
    if (inputs.file !== undefined) {
      try {
        await dispatch(uploadImage(inputs)).unwrap();
        dispatch(sortImageList(sortMode));
        dispatch(makeToast("Saved new image"));
        navigate("/images");
      } catch (error) {
        const err = error as Error;
        dispatch(makeToast(err.message));
      }
    }
  };

  const handleClickCancel = () => {
    navigate("/images");
  };

  const overSizeLimit = inputs.file ? inputs.file.size > 10485760 : false;
  const overUploadLimit = allImages.length >= 10;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Typography component="h1" variant="h4">
        Upload Image
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
      <Box>
        <InfoText showError={false}>File Types: jpg / png</InfoText>
        <InfoText showError={overSizeLimit}>Size Limit: 10 Mb</InfoText>
        <InfoText showError={overUploadLimit}>
          Upload Limit: {allImages.length} of 10 images
        </InfoText>
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
        disabled={inputs.file === undefined || overSizeLimit || overUploadLimit}
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
