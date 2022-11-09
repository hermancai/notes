import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user: string;
      userId: string;
    }
  }
}

// Set username and userId in request body after verifying access token
const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers.authorization;
  if (!headerToken || !headerToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: true, message: "Missing bearer token" });
  }

  const accessToken = headerToken.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as TokenPayload;
    req.user = decoded.username;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid bearer token" });
  }
};

export default verifyUser;
