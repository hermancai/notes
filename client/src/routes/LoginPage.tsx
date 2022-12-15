import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, login, signup } from "../features/user/userSlice";
import ColorModeToggle from "../components/shared/ColorModeToggle";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Theme,
  SxProps,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { UserInterfaces } from "../interfaces/UserInterfaces";
import { useNavigate } from "react-router-dom";
import { Person, Lock, ErrorOutlineOutlined } from "@mui/icons-material";

const inputStyles: SxProps<Theme> = {
  "& legend": { display: "none" },
  "& fieldset": { top: 0 },
  backgroundColor: "background.default",
  "& .MuiInputBase-input": { padding: "0.75rem 0.75rem 0.75rem 0" },
};

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(resetUser());
  }, [dispatch]);

  const [showLogin, setShowLogin] = React.useState(true);
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
      showLogin ? handleLogin() : handleSignup();
    }
  };

  // Attempt login
  const handleLogin = async () => {
    try {
      const res = await dispatch(login(inputs)).unwrap();
      if (!res.error) {
        navigate("/");
      }
      setErrorMessage(res.message);
    } catch (err) {
      console.log("Login Error:\n", err);
    }
  };

  // Attempt signup then login
  const handleSignup = async () => {
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

  // Login using guest credentials
  const handleGuestLogin = async () => {
    try {
      const res = await dispatch(
        login({ username: "Guest", password: "password" })
      ).unwrap();
      if (!res.error) {
        navigate("/");
      }
    } catch (err) {
      console.log("Login Error:\n", err);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          padding: "0.5rem",
        }}
      >
        <ColorModeToggle />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          alignItems: "center",
          width: { xs: "90%", sm: 400 },
          border: "solid 1px",
          borderColor: "action.disabled",
          borderRadius: 1,
          margin: "2rem 0",
          padding: "2rem 1rem",
          backgroundColor: "action.hover",
          gap: "2rem",
        }}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{
            textAlign: "center",
            textDecoration: "underline",
            textDecorationColor: green[500],
            textUnderlineOffset: "0.5rem",
          }}
        >
          {showLogin ? "Login to your account" : "Register a new account"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "90%",
          }}
        >
          <TextField
            placeholder="Username"
            name="username"
            type="text"
            onChange={handleChange}
            onKeyUp={handleKeyPress}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
              "aria-label": "username",
            }}
          />
          <TextField
            placeholder="Password"
            name="password"
            type="password"
            onChange={handleChange}
            onKeyUp={handleKeyPress}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              "aria-label": "password",
            }}
          />
          {errorMessage === "" ? null : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                color: "error.light",
                backgroundColor: "background.default",
                padding: "0.5rem",
                border: "solid 1px",
                borderColor: "error.light",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <ErrorOutlineOutlined />
              {errorMessage}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "50%",
          }}
        >
          <Button
            variant="contained"
            onClick={showLogin ? handleLogin : handleSignup}
            fullWidth
            sx={{
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
              color: "white",
            }}
            disabled={loading}
          >
            {showLogin ? "LOGIN" : "SIGN UP"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleGuestLogin}
            disabled={loading}
            fullWidth
          >
            Guest Login
          </Button>
        </Box>

        <Typography
          variant="body1"
          component="p"
          sx={{ textAlign: "center", color: "text.secondary" }}
        >
          {showLogin ? "Don't have an account" : "Already have an account"}
          {"? "}
          <Button
            variant="text"
            onClick={
              showLogin ? () => setShowLogin(false) : () => setShowLogin(true)
            }
            sx={{ textTransform: "none" }}
            disabled={loading}
          >
            {showLogin ? "SIGN UP" : "LOGIN"}
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
