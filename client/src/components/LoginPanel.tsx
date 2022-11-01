import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { login } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Credentials } from "../interfaces/interfaces";
import { Container, Box, Input, Button } from "@mui/material";
import { Person, Lock, ErrorOutlineOutlined } from "@mui/icons-material";
import GuestLoginButton from "./GuestLoginButton";

export default function LoginPanel(props: {
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
        mt: "3rem",
      }}
    >
      <h1>LOGIN</h1>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: { xs: "100%", sm: "300px" },
          border: "solid 1px black",
          borderRadius: "99px",
          padding: "5px 15px",
        }}
      >
        <Person sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <Input
          placeholder="Username"
          name="username"
          type="text"
          disableUnderline
          onChange={handleChange}
          onKeyUp={handleKeyPress}
          inputProps={{ "aria-label": "username" }}
          fullWidth
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: { xs: "100%", sm: "300px" },
          border: "solid 1px black",
          borderRadius: "99px",
          padding: "5px 15px",
        }}
      >
        <Lock sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <Input
          placeholder="Password"
          name="password"
          type="password"
          disableUnderline
          onChange={handleChange}
          onKeyUp={handleKeyPress}
          inputProps={{ "aria-label": "password" }}
          fullWidth
        />
      </Box>
      {errorMessage === "" ? null : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <ErrorOutlineOutlined />
          <p>{errorMessage}</p>
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
          variant="text"
          onClick={handleSubmit}
          sx={{ border: "solid 1px black", flex: "1", borderRadius: "99px" }}
          disabled={loading}
        >
          LOGIN
        </Button>
        <Button
          variant="text"
          onClick={() => props.setShowLogin(false)}
          sx={{ border: "solid 1px black", flex: "1", borderRadius: "99px" }}
          disabled={loading}
        >
          SIGN UP
        </Button>
      </Box>

      <GuestLoginButton />
    </Container>
  );
}
