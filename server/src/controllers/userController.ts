import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import signupSchema from "../schemas/signupSchema";
import { Credentials } from "../interfaces/interfaces";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";

// @desc   Register new user in database
// @route  POST /api/user/signup
const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password }: Credentials = req.body;

  // Check username and password exist
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Enter a username and password" });
  }

  // Check valid username and password
  const { error } = signupSchema.validate({ username, password });
  if (error) {
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });
  }

  // Check username taken
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser !== null) {
    return res
      .status(400)
      .json({ error: true, message: "The username is taken" });
  }

  // Store user and password in database
  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
  const newUser = await User.create({ username, password: hashedPassword });

  if (newUser === null) {
    return res.status(400).json({
      error: true,
      message: "Something went wrong while creating a new account",
    });
  }

  return res.status(200).json({
    error: false,
    message: "Account creation successful",
    username: username,
  });
};

// @desc   Send new refresh and access tokens
// @route  POST /api/user/login
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password }: Credentials = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Enter a username and password" });
  }

  // Check username exists
  const user = await User.findOne({ where: { username } });
  if (user === null) {
    return res
      .status(400)
      .json({ error: true, message: "The username does not exist" });
  }

  // Compare given password with stored password
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: true, message: "Incorrect password" });
  }

  // Sign and send tokens
  try {
    const payload = { username: username, userId: user.userId };
    const accessToken = generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    res.status(200).json({
      error: false,
      message: "Login successful",
      username: username,
      accessToken,
    });
  } catch (err) {
    res.status(400);
    return next(err);
  }
};

// @desc   Delete user account
// @route  DELETE /api/user/
const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user === "Guest") {
    return res
      .status(400)
      .json({ error: true, message: "Deleting guest account not allowed" });
  }

  // Remove user from database and remove cookie
  const user = await User.findOne({ where: { username: req.user } });
  if (!user) {
    return res.status(400).json({ error: true, message: "User not found" });
  }
  await user.destroy();
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

  return res
    .status(200)
    .json({ error: false, message: "Account deleted successfully" });
};

export { signUpUser, loginUser, deleteAccount };
