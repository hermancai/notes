import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import useSetUsername from "../hooks/useSetUsername";
import { getNotes, sortNoteList, NoteState } from "../features/note/noteSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, MenuItem, Menu } from "@mui/material";
import { Add, KeyboardArrowDown } from "@mui/icons-material";
import NoteCard from "../components/notes/NoteCard";

const sortOptions: Array<NoteState["sortMode"]> = [
  "Newest",
  "Oldest",
  "Last Updated",
];

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username } = useSelector((state: RootState) => state.user);

  const { allNotes, loading, initialFetch, sortMode } = useSelector(
    (state: RootState) => state.note
  );

  useSetUsername();

  React.useEffect(() => {
    const getAllNotes = async () => {
      try {
        // Only make one GET request to server
        if (username !== undefined && !initialFetch) {
          await dispatch(getNotes()).unwrap();
        }
      } catch (err) {
        navigate("/login");
      }
    };

    getAllNotes();
  }, [navigate, dispatch, initialFetch, username]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickSortMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClickSortOption = (sortMode: NoteState["sortMode"]) => {
    setAnchorEl(null);
    dispatch(sortNoteList(sortMode));
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
              {sortMode} <KeyboardArrowDown />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseSortMenu}>
              {sortOptions.map((option: NoteState["sortMode"]) => (
                <MenuItem
                  key={option}
                  selected={option === sortMode}
                  onClick={() => handleClickSortOption(option)}
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
