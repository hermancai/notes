import * as React from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
} from "@mui/material";
import { Menu, ChevronLeft } from "@mui/icons-material";

export default function Sidebar(props: {
  drawerWidth: number;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
        <Toolbar>
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
