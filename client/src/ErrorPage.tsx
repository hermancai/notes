import { useNavigate, useRouteError } from "react-router-dom";
import { Box, Button } from "@mui/material";

interface ErrorInterface {
  status?: number;
  statusText?: string;
  message?: string;
}

function HomeButton() {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate("/")}>
      Homepage
    </Button>
  );
}

export default function ErrorPage() {
  const error = useRouteError() as ErrorInterface;

  return (
    <Box sx={{ padding: "2rem" }}>
      <h1>{error.status}</h1>
      <p>
        Sorry,{" "}
        {error.status === 404
          ? "this page was not found!"
          : "an unexpected error occurred!"}
      </p>
      <HomeButton />
    </Box>
  );
}
