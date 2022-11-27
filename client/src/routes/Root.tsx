import React from "react";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { resetAllNotes } from "../features/note/noteSlice";
import { clearAllToasts } from "../features/toast/toastSlice";
import { useNavigate, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import { Box, Toolbar, Divider, Skeleton } from "@mui/material";
import {
  PersonOutlineOutlined,
  Logout,
  StickyNote2Outlined,
  CameraAltOutlined,
} from "@mui/icons-material";
import SidebarLink from "../components/shared/SidebarLink";
import ColorModeToggle from "../components/shared/ColorModeToggle";
import Toast from "../components/shared/Toast";
import SearchResults from "../components/shared/SearchResults";

const drawerWidth = 250;

export default function Root() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { username, loading, searchQuery } = useSelector(
    (state: RootState) => state.user
  );

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      dispatch(resetAllNotes());
      dispatch(clearAllToasts());
      navigate("/login");
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minWidth: `${drawerWidth + 50}px`,
        visibility: loading ? "hidden" : "visible",
      }}
    >
      <Sidebar drawerWidth={drawerWidth}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <ColorModeToggle />

          <Divider sx={{ margin: "1rem 0" }} />

          <NavLink to="/account" style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <SidebarLink onClick={() => {}} isActive={isActive}>
                <PersonOutlineOutlined />
                <p>
                  {!username ? (
                    <Skeleton sx={{ backgroundColor: "transparent" }} />
                  ) : (
                    username
                  )}
                </p>
              </SidebarLink>
            )}
          </NavLink>

          <SidebarLink onClick={handleLogout} isActive={false}>
            <Logout />
            <p>Log Out</p>
          </SidebarLink>

          <Divider sx={{ margin: "1rem 0" }} />

          <NavLink to="/" end style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <SidebarLink onClick={() => {}} isActive={isActive}>
                <StickyNote2Outlined />
                <p>Notes</p>
              </SidebarLink>
            )}
          </NavLink>

          <NavLink to="/images" style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <SidebarLink onClick={() => {}} isActive={isActive}>
                <CameraAltOutlined />
                <p>Images</p>
              </SidebarLink>
            )}
          </NavLink>
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
        {searchQuery === "" ? <Outlet /> : <SearchResults />}
        <Toast />
      </Box>
    </Box>
  );
}
