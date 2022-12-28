import React from "react";
import { Button, Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LightMode, DarkMode } from "@mui/icons-material";
import { ColorModeContext } from "../../App";

export default function ColorModeToggle() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <Button
      onClick={colorMode.toggleColorMode}
      sx={{
        display: "flex",
        justifyContent: "start",
        gap: "0.25rem",
        color: "primary.light",
      }}
    >
      {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}

      <Switch checked={theme.palette.mode === "light"} color="default" />
    </Button>
  );
}
