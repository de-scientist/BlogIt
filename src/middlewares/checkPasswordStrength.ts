import { type Request, type Response, type NextFunction } from "express";
import zxcvbn from "zxcvbn";

export function checkPasswordStrength(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;

    //validate presence of a password
    if (!password || typeof password !== "string" ) {
        return res.status(400).json({ message: "Password is required and must be a string."});
    }
    
    //check password strength
    const result = zxcvbn(password);

    if (result.score < 3 ) {
        res.status(400).json({ message: "Please use a stronger password"});
        return;
    }
    next();
}