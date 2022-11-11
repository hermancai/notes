import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { signup, login } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Credentials } from "../interfaces/interfaces";
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

export default function SignupPanel(props: {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.user.loading);
  const [inputs, setInputs] = React.useState<Credentials>({
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

  // Attempt signup and login
  const handleSubmit = async () => {
    const signupRes = await dispatch(signup(inputs)).unwrap();
    if (signupRes.error) {
      return setErrorMessage(signupRes.message);
    }

    const loginRes = await dispatch(login(inputs)).unwrap();
    if (loginRes.error) {
      return setErrorMessage(loginRes.message);
    }
    navigate("/");
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
        Sign Up
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
          Sign Up
        </Button>
        <Button
          variant="outlined"
          onClick={() => props.setShowLogin(true)}
          sx={{ flex: "1" }}
          disabled={loading}
        >
          Login
        </Button>
      </Box>
      <GuestLoginButton />
    </Container>
  );
}
