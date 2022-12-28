import * as React from "react";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../features/user/userSlice";
import debounce from "lodash.debounce";
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

interface SidebarProps {
  drawerWidth: number;
  children: React.ReactNode;
  mobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export default function Sidebar({
  drawerWidth,
  children,
  mobileSidebarOpen,
  openMobileSidebar,
  closeMobileSidebar,
}: SidebarProps) {
  const dispatch = useDispatch();

  // For debouncing search when user types
  const [liveSearchValue, setLiveSearchValue] = React.useState("");
  const { searchQuery } = useSelector((state: RootState) => state.user);

  const debouncedUpdateSearchQuery = React.useMemo(
    () =>
      debounce(
        (query: string) => {
          dispatch(setSearchQuery(query));
        },
        500,
        { leading: true }
      ),
    [dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLiveSearchValue(e.target.value);
    debouncedUpdateSearchQuery(e.target.value);
  };

  const clearSearch = React.useCallback(() => {
    setLiveSearchValue("");
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        enableColorOnDark
        color="inherit"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          boxShadow: "none",
          borderBottom: "solid 1px",
          borderColor: "divider",
          backgroundImage: "unset",
        }}
      >
        <Toolbar
          sx={{
            marginRight: { lg: `${drawerWidth}px` },
            padding: "0.75rem 1.5rem",
          }}
        >
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={openMobileSidebar}
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
                value={liveSearchValue}
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
          width: { lg: drawerWidth },
          flexShrink: { lg: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileSidebarOpen}
          onClose={closeMobileSidebar}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              color="inherit"
              aria-label="close drawer"
              edge="end"
              onClick={closeMobileSidebar}
              sx={{ mr: "0.5rem", display: { lg: "none" } }}
            >
              <ChevronLeft />
            </IconButton>
          </Toolbar>
          <Divider />
          {children}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Toolbar />
          <Divider />
          {children}
        </Drawer>
      </Box>
    </Box>
  );
}
