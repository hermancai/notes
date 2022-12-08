import React from "react";
import { RootState } from "./app/store";
import { useDispatch, useSelector } from "react-redux";
import { setColorMode, getColorMode } from "./features/user/userSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import ErrorPage from "./ErrorPage";
import LoginPage from "./routes/LoginPage";
import HomePage from "./routes/HomePage";
import AccountPage from "./routes/AccountPage";
import ImagesPage from "./routes/ImagesPage";
import NewNotePage from "./routes/NewNotePage";
import UpdateNotePage from "./routes/UpdateNotePage";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import NewImagePage from "./routes/NewImagePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/notes/new",
        element: <NewNotePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/notes/update",
        element: <UpdateNotePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/images",
        element: <ImagesPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/images/new",
        element: <NewImagePage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default function App() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getColorMode());
  }, [dispatch]);

  const mode = useSelector((state: RootState) => state.user.colorMode);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        dispatch(setColorMode());
      },
    }),
    [dispatch]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode, primary: { main: green[500] } },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
