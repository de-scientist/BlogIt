import { type Request, type Response, type NextFunction } from "express";

export function checkDetails(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, userName, emailAddress, password } = req.body;

    if
}