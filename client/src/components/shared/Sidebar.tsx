import * as React from "react";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../features/user/userSlice";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  InputBase,
} from "@mui/material";
import {
  Menu,
  ChevronLeft,
  SearchRounded,
  ClearRounded,
} from "@mui/icons-material";

export default function Sidebar(props: {
  drawerWidth: number;
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { searchQuery } = useSelector((state: RootState) => state.user);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const clearSearch = React.useCallback(() => {
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  const handleDrawerToggle = React.useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        enableColorOnDark
        color="inherit"
        sx={{
          width: { lg: `calc(100% - ${props.drawerWidth}px)` },
          ml: { lg: `${props.drawerWidth}px` },
          boxShadow: "none",
          borderBottom: "solid 1px",
          borderColor: "divider",
          backgroundImage: "unset",
        }}
      >
        <Toolbar
          sx={{
            marginRight: { lg: `${props.drawerWidth}px` },
            padding: "0.75rem 1.5rem",
          }}
        >
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { lg: "none" },
              }}
            >
              <Menu />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                width: "100%",
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
                alignItems: "center",
                padding: "0.25rem 1rem",
                gap: "0.5rem",
                borderRadius: "5px",
              }}
            >
              <SearchRounded />
              <InputBase
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
                sx={{ width: "100%" }}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Box
                onClick={clearSearch}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                  display: searchQuery === "" ? "none" : "flex",
                  borderRadius: "99px",
                  padding: "0.25rem",
                }}
              >
                <ClearRounded />
              </Box>
            </Box>
          </>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { lg: props.drawerWidth },
          flexShrink: { lg: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: props.drawerWidth,
            },
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              color="inherit"
              aria-label="close drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ mr: "0.5rem", display: { lg: "none" } }}
            >
              <ChevronLeft />
            </IconButton>
          </Toolbar>
          <Divider />
          {props.children}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: props.drawerWidth,
            },
          }}
          open
        >
          <Toolbar />
          <Divider />
          {props.children}
        </Drawer>
      </Box>
    </Box>
  );
}
