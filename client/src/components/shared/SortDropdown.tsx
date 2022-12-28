import React from "react";
import { SortModes } from "shared";
import { Box, Button, MenuItem, Menu } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const sortOptions: Array<SortModes["sortMode"]> = [
  "Newest",
  "Oldest",
  "Last Updated",
];

interface DropdownProps {
  sortMode: SortModes["sortMode"];
  handleSortList: (sortMode: SortModes["sortMode"]) => void;
}

export default function SortDropdown({
  sortMode,
  handleSortList,
}: DropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickSortMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClickSortOption = (sortMode: SortModes["sortMode"]) => {
    setAnchorEl(null);
    handleSortList(sortMode);
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleClickSortMenu}>
        {sortMode} <KeyboardArrowDown />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseSortMenu}>
        {sortOptions.map((option: SortModes["sortMode"]) => (
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
  );
}
