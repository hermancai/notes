import React from "react";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Box, CssBaseline, Toolbar, Divider } from "@mui/material";
import {
  PersonOutlineOutlined,
  Logout,
  Notes,
  InsertPhotoOutlined,
} from "@mui/icons-material";
import SidebarLink from "../components/SidebarLink";

const drawerWidth = 250;

export default function Root() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar drawerWidth={drawerWidth}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <SidebarLink
            onClick={() => {
              navigate("/account");
            }}
          >
            <PersonOutlineOutlined />
            <p>{username}</p>
          </SidebarLink>
          <SidebarLink onClick={handleLogout}>
            <Logout />
            <p>Log Out</p>
          </SidebarLink>
          <Divider sx={{ margin: "1rem 0" }} />
          <SidebarLink
            onClick={() => {
              navigate("/");
            }}
          >
            <Notes />
            <p>Notes</p>
          </SidebarLink>
          <SidebarLink
            onClick={() => {
              navigate("/images");
            }}
          >
            <InsertPhotoOutlined />
            <p>Images</p>
          </SidebarLink>
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
