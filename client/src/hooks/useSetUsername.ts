import React from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { verifyAccessToken } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

// When navigating to pages via URL, this hook handles
// token verification and setting up the user in redux
export default function useSetUsername() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username } = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    const getUsername = async () => {
      try {
        await dispatch(verifyAccessToken()).unwrap();
      } catch (err) {
        navigate("/login");
      }
    };

    if (username === undefined) {
      getUsername();
    }
  }, [dispatch, navigate, username]);
}
