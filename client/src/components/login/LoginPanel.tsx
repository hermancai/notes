import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { login } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { UserInterfaces } from "../../interfaces/UserInterfaces";
import {
  Container,
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Person, Lock, ErrorOutlineOutlined } from "@mui/icons-material";
import GuestLoginButton from "./GuestLoginButton";

export default function LoginPanel(props: {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.user.loading);
  const [inputs, setInputs] = React.useState<UserInterfaces.UserCredentials>({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = React.useState("");

  // Handle input changes in form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Submit using enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!loading && e.key === "Enter") {
      handleSubmit();
    }
  };

  // Attempt login
  const handleSubmit = async () => {
    try {
      const res = await dispatch(login(inputs)).unwrap();
      if (!res.error) {
        navigate("/");
      }
      setErrorMessage(res.message);
    } catch (err) {
      console.log("An error occurred while logging in:\n", err);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        mt: "2rem",
      }}
    >
      <Typography variant="h3" component="h1">
        Login
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          width: { xs: "100%", sm: "300px" },
        }}
      >
        <TextField
          placeholder="Username"
          name="username"
          type="text"
          onChange={handleChange}
          onKeyUp={handleKeyPress}
          sx={{
            "& legend": { display: "none" },
            "& fieldset": { top: 0 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
            "aria-label": "username",
            className: `input: {backgroundColor: "blue"}`,
          }}
        />
        <TextField
          placeholder="Password"
          name="password"
          type="password"
          onChange={handleChange}
          onKeyUp={handleKeyPress}
          sx={{
            "& legend": { display: "none" },
            "& fieldset": { top: 0 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            "aria-label": "password",
          }}
        />
      </Box>
      {errorMessage === "" ? null : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "error.light",
          }}
        >
          <ErrorOutlineOutlined />
          {errorMessage}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          width: { xs: "100%", sm: "300px" },
        }}
      >
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            flex: "1",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
            color: "white",
          }}
          disabled={loading}
        >
          LOGIN
        </Button>
        <Button
          variant="outlined"
          onClick={() => props.setShowLogin(false)}
          sx={{ flex: "1" }}
          disabled={loading}
        >
          SIGN UP
        </Button>
      </Box>

      <GuestLoginButton />
    </Container>
  );
}
