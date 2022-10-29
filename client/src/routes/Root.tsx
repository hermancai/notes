import React from "react";
import type { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { setUser, resetUser } from "../features/user/userSlice";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ServerResponse } from "../interfaces/interfaces";
import Sidebar from "../components/Sidebar";
import { Box, CssBaseline, Toolbar } from "@mui/material";

const drawerWidth = 250;

export default function Root() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedIn, username } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = React.useState(true);
  // TODO: Change sidebar contents based on login status

  // Send current access token. If invalid, get new access token.
  // If refresh token is invalid, redirect to login.
  React.useEffect(() => {
    const verifyAccessToken = async (token: string | null) => {
      if (token === null) {
        throw new Error("No access token");
      }
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = (await response.json()) as ServerResponse;
      if (res.error) {
        throw new Error(res.message);
      }
      dispatch(setUser({ username: res.username!, accessToken: token }));
      setLoading(false);
      navigate("/home");
    };

    const getNewAccessToken = async () => {
      const response = await fetch("/api/token", {
        method: "PUT",
        credentials: "include",
      });
      const res = (await response.json()) as ServerResponse;

      if (res.error) {
        dispatch(resetUser());
        setLoading(false);
        return navigate("/login");
      }

      dispatch(
        setUser({ username: res.username!, accessToken: res.accessToken! })
      );
      setLoading(false);
      navigate("/home");
    };

    setLoading(true);
    verifyAccessToken(localStorage.getItem("accessToken")).catch((err) => {
      getNewAccessToken();
    });
  }, [navigate, dispatch]);

  return loading ? null : (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar drawerWidth={drawerWidth}>
        <Box sx={{ padding: "1rem" }}>
          {loggedIn ? (
            <p>Username: {username}</p>
          ) : (
            <p>Log in to see your storage.</p>
          )}
        </Box>
      </Sidebar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mr: { lg: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
