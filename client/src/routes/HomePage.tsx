import React from "react";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { verifyAccessToken } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  React.useEffect(() => {
    const verifyUser = async () => {
      try {
        await dispatch(verifyAccessToken()).unwrap();
      } catch (err) {
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate, dispatch]);

  return <div>home page</div>;
}
