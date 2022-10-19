import express, { Request, Response } from "express";

const app = express();

app.get("/", async (req: Request, res: Response) => {
  console.log("get /");
  res.json({ message: "hello" });
});

app.get("/get", async (req: Request, res: Response) => {
  console.log("get /get");
  res.json({ message: "hello" });
});

const port = 5000;

app.listen(port, (): void => {
  console.log(`Listening at http://localhost:${port}`);
});
