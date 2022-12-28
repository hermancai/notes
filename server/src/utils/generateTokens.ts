import jwt from "jsonwebtoken";
import Token from "../models/Token";
import { TokenPayload } from "shared";

const ACCESS_EXP = "15m";
const REFRESH_EXP = "30d";

// Generate an access token
const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_EXP,
  });
};

// Generate a refresh token and replace token in database
const generateRefreshToken = async (payload: TokenPayload) => {
  const newToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: REFRESH_EXP,
  });

  const existingRefreshToken = await Token.findOne({
    where: { userId: payload.userId },
  });
  if (existingRefreshToken !== null) {
    await existingRefreshToken.destroy();
  }
  await Token.create({ userId: payload.userId, token: newToken });

  return newToken;
};

export { generateAccessToken, generateRefreshToken };
