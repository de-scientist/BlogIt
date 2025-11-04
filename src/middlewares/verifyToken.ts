import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

//create interface user
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
        res.status(401).json({ message: "Unauthorized! Please login."});
        return;
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY!);
        req.user = decoded as User;
    } catch (error) {
        res.status(500).json({ message: "Something went wrong! Please try again."});
    }
    next();
}