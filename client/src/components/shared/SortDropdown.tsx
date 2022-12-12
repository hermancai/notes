import React from "react";
import { SharedInterfaces } from "../../interfaces/SharedInterfaces";
import { Box, Button, MenuItem, Menu } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const sortOptions: Array<SharedInterfaces.SortModes["sortMode"]> = [
  "Newest",
  "Oldest",
  "Last Updated",
];

interface DropdownProps {
  sortMode: SharedInterfaces.SortModes["sortMode"];
  handleSortList: (sortMode: SharedInterfaces.SortModes["sortMode"]) => void;
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

  const handleClickSortOption = (
    sortMode: SharedInterfaces.SortModes["sortMode"]
  ) => {
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
        {sortOptions.map((option: SharedInterfaces.SortModes["sortMode"]) => (
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
