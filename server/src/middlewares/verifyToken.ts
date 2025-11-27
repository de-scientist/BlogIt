import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const { authToken } = req.cookies;

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized! Please login." });
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY!) as User;
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
}
