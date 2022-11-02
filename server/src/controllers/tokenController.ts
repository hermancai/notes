import { Response, Request, NextFunction } from "express";
import Token from "../models/Token";
import { TokenPayload } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";

// @desc   Verify access token
// @route  POST /api/token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers.authorization;
  if (headerToken === undefined || !headerToken.startsWith("Bearer")) {
    console.log("missing access token", new Date().toISOString());

    return res
      .status(400)
      .json({ error: true, message: "Missing access token" });
  }

  try {
    const accessToken = headerToken.split(" ")[1];
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as TokenPayload;

    console.log("valid access token", new Date().toISOString());

    return res.status(200).json({
      error: false,
      message: "Valid access token",
      username: decoded.username,
      accessToken: accessToken,
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
    console.log("refresh token not found in request", new Date().toISOString());

    return res
      .status(400)
      .json({ error: true, message: "Refresh token not found" });
  }

  // Look for matching refresh token in database
  const storedRefreshToken = await Token.findOne({
    where: { token: reqRefreshToken },
  });
  if (!storedRefreshToken) {
    console.log(
      "refresh token does not exist in database",
      new Date().toISOString()
    );

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

    console.log("send new access token", new Date().toISOString());

    res.status(200).json({
      error: false,
      accessToken,
      message: "Renewed access token",
      username: decoded.username,
    });
  } catch (err) {
    console.log("error sending new access token: ", err);

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
