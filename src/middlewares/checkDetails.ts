import { type Request, type Response, type NextFunction } from "express";

export function checkDetails(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, userName, emailAddress, password } = req.body;

    //check if first name is entered
    if (!firstName) {
        res.status(400).json({ message:"First name is required" });
        return;
    }

    //check 
}