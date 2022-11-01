import React from "react";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Box, CssBaseline, Toolbar } from "@mui/material";

const drawerWidth = 250;

export default function Root() {
  const { username } = useSelector((state: RootState) => state.user);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar drawerWidth={drawerWidth}>
        <Box sx={{ padding: "1rem" }}>
          <p>Username: {username}</p>
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
