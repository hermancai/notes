import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "shared";
import jwt from "jsonwebtoken";

// Set username and userId in request body after verifying access token
const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers.authorization;
  if (!headerToken || !headerToken.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Error: Missing bearer token" });
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
    return res.status(401).json({ message: "Error: Invalid bearer token" });
  }
};

export default verifyUser;
