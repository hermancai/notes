import React from "react";
import LoginPanel from "../components/LoginPanel";
import SignupPanel from "../components/SignupPanel";

export default function LoginPage() {
  const [showLogin, setShowLogin] = React.useState(true);

  return showLogin ? (
    <LoginPanel setShowLogin={setShowLogin} />
  ) : (
    <SignupPanel setShowLogin={setShowLogin} />
  );
}
