import { Response, Request, NextFunction } from "express";
import Token from "../models/Token";
import { TokenPayload } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";

// @desc   Verify access token
// @route  POST /api/token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers.authorization;
  if (headerToken === undefined || !headerToken.startsWith("Bearer")) {
    return res
      .status(400)
      .json({ error: true, message: "Missing access token" });
  }

  try {
    const decoded = jwt.verify(
      headerToken.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET!
    ) as TokenPayload;
    return res.status(200).json({
      error: false,
      message: "Valid access token",
      username: decoded.username,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc   Send new access token if refresh token is valid
// @route  PUT /api/token
const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqRefreshToken = req.cookies["refreshToken"] as string;

  if (!reqRefreshToken) {
    return res
      .status(400)
      .json({ error: true, message: "Refresh token not found" });
  }

  // Look for matching refresh token in database
  const storedRefreshToken = await Token.findOne({
    where: { token: reqRefreshToken },
  });
  if (!storedRefreshToken) {
    return res
      .status(400)
      .json({ error: true, message: "Refresh token does not exist" });
  }

  // Send new access token
  try {
    const decoded = jwt.verify(
      reqRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as TokenPayload;

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      error: false,
      accessToken,
      message: "Renewed access token",
      username: decoded.username,
    });
  } catch (err) {
    return next(err);
  }
};

//@desc   Remove refresh token from database
//@route  DELETE /api/token
const deleteToken = async (req: Request, res: Response, next: NextFunction) => {
  const reqRefreshToken = req.cookies["refreshToken"] as string;

  if (!reqRefreshToken) {
    return res
      .status(400)
      .json({ error: true, message: "Refresh token not found" });
  }

  try {
    await Token.destroy({ where: { token: reqRefreshToken } });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    return res.status(200).json({ error: false, message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

export { refreshAccessToken, verifyToken, deleteToken };
