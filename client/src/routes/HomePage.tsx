import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "../features/user/userSlice";
import { getNotes, sortNoteList } from "../features/note/noteSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, MenuItem, Menu } from "@mui/material";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import NoteCard from "../components/NoteCard";

const sortOptions = ["Newest", "Oldest", "Last Updated"];

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { allNotes, loading } = useSelector((state: RootState) => state.note);

  React.useEffect(() => {
    const getAllNotes = async () => {
      try {
        await dispatch(getNotes()).unwrap();
        dispatch(setUsername());
      } catch (err) {
        navigate("/login");
      }
    };

    getAllNotes();
  }, [navigate, dispatch]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(2);
  const open = Boolean(anchorEl);

  const handleClickSortMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClickSortOption = (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);

    switch (index) {
      case 0:
        dispatch(sortNoteList("new"));
        break;
      case 1:
        dispatch(sortNoteList("old"));
        break;
      case 2:
        dispatch(sortNoteList("update"));
        break;
    }
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  return loading ? null : (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Button
        variant="contained"
        onClick={() => navigate("/notes/new")}
        sx={{ color: "white" }}
      >
        <Add />
        New Note
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "1.25rem", color: "text.secondary" }}>
          {allNotes.length === 0 ? "Notes (0)" : `Notes (${allNotes.length}):`}
        </Typography>
        {allNotes.length < 2 ? null : (
          <Box>
            <Button variant="outlined" onClick={handleClickSortMenu}>
              {sortOptions[selectedIndex]} <KeyboardArrowDown />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseSortMenu}>
              {sortOptions.map((option, index) => (
                <MenuItem
                  key={option}
                  selected={index === selectedIndex}
                  onClick={(e) => handleClickSortOption(e, index)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Box>
      {allNotes.map((note) => {
        return <NoteCard note={note} key={note.id} />;
      })}
    </Box>
  );
}
