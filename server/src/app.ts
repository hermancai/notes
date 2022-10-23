import { config } from "dotenv";
import express, { Request, Response } from "express";
import connectToDatabase from "./dbConnect";
import userRouter from './routes/userRoute'
import errorHandler from './middleware/errorHandler'

config();
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get("/get", async (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

app.use("/api/user", userRouter);

connectToDatabase();

app.use(errorHandler)

app.listen(process.env.PORT || 5000, (): void => {
  const port = process.env.PORT ? process.env.PORT : 5000;
  console.log(`Listening at http://localhost:${port}`);
});
