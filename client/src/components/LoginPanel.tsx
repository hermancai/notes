import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { ServerResponse } from "../interfaces/interfaces";
import { Container, Box, Input, Button } from "@mui/material";
import { Person, Lock, ErrorOutlineOutlined } from "@mui/icons-material";
import GuestLoginButton from "./GuestLoginButton";

export default function LoginPanel(props: {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = React.useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await response.json()) as ServerResponse;

    if (res.error) {
      return setErrorMessage(res.message);
    }

    setErrorMessage("");
    dispatch(
      setUser({ accessToken: res.accessToken!, username: res.username! })
    );
    return navigate("/home");
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
        >
          LOGIN
        </Button>
        <Button
          variant="text"
          onClick={() => props.setShowLogin(false)}
          sx={{ border: "solid 1px black", flex: "1", borderRadius: "99px" }}
        >
          SIGN UP
        </Button>
      </Box>

      <GuestLoginButton />
    </Container>
  );
}
