import { config } from "dotenv";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/dbConnect";
import userRouter from "./routes/userRoute";
import noteRouter from "./routes/noteRoute";
import imageRouter from "./routes/imageRoute";
import refreshRouter from "./routes/refreshRoute";
import errorHandler from "./middleware/errorHandler";

config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.use("/api/user", userRouter);
app.use("/api/token", refreshRouter);
app.use("/api/note", noteRouter);
app.use("/api/image", imageRouter);

app.get("/api/health", (req, res) => {
  res.status(200).send();
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
});

app.use(errorHandler);

connectToDatabase();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
