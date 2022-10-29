import jwt from "jsonwebtoken";
import User from "../models/User";
import Token from "../models/Token";
import { TokenPayload } from "../interfaces/interfaces";

const ACCESS_EXP = "15m";
const REFRESH_EXP = "30d";

// Generate an access token
const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(
    { username: payload.username },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: ACCESS_EXP }
  );
};

// Generate a refresh token and replace token in database
const generateRefreshToken = async (payload: TokenPayload, userId: string) => {
  const newToken = jwt.sign(
    { username: payload.username },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: REFRESH_EXP }
  );

  const existingRefreshToken = await Token.findOne({
    where: { userId: userId },
  });
  if (existingRefreshToken !== null) {
    await existingRefreshToken.destroy();
  }
  await Token.create({ userId: userId, token: newToken });

  return newToken;
};

export { generateAccessToken, generateRefreshToken };
