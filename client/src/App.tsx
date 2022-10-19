import { useState } from "react";
import Button from "@mui/material/Button";

const App = () => {
  const [message, setMessage] = useState("");

  const onClick = async () => {
    const res = await fetch("/get");
    const resJSON: { message: string } = await res.json();
    setMessage(resJSON.message);
  };

  return (
    <>
      <Button onClick={onClick} variant="contained">
        click
      </Button>
      <p>message: {message}</p>
    </>
  );
};

export default App;
