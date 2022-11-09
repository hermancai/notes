import { Box } from "@mui/material";

export default function LoadingOverlay() {
  return (
    <Box
      sx={{
        zIndex: "10",
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>LOADING</p>
    </Box>
  );
}
