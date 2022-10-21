import { config } from "dotenv";
import express, { Request, Response } from "express";
import connectToDatabase from "./dbConnect";

config();
const app = express();

app.get("/get", async (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

connectToDatabase();

app.listen(process.env.PORT || 5000, (): void => {
  const port = process.env.PORT ? process.env.PORT : 5000;
  console.log(`Listening at http://localhost:${port}`);
});
