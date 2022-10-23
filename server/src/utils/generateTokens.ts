import jwt from "jsonwebtoken";
import User from "../models/User";
import Token from "../models/Token";

// Create an access token and a refresh token
const generateTokens = async (user: User) => {
  // Sign tokens
  const payload = {userId: user.userId};
  const accessToken = jwt.sign(
    payload, process.env.ACCESS_TOKEN_SECRET!,
    {expiresIn: "1m"}
  );
  const refreshToken = jwt.sign(
    payload, process.env.REFRESH_TOKEN_SECRET!,
    {expiresIn: "10m"}
  );

  // Update refresh token in database
  const existingRefreshToken = await Token.findOne({where: {"userId": user.userId}});
  if (existingRefreshToken !== null) {
    await existingRefreshToken.destroy();
  }
  await Token.create({"userId": user.userId, "token": refreshToken});
  
  return {accessToken, refreshToken};
}

export default generateTokens;