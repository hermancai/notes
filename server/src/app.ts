import { config } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToDatabase from "./config/dbConnect";
import userRouter from "./routes/userRoute";
import noteRouter from "./routes/noteRoute";
import imageRouter from "./routes/imageRoute";
import refreshRouter from "./routes/refreshRoute";
import errorHandler from "./middleware/errorHandler";

config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/token", refreshRouter);
app.use("/api/note", noteRouter);
app.use("/api/image", imageRouter);

connectToDatabase();

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
