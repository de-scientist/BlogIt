import { type Request, type Response, type NextFunction } from "express";

export const validateBlogDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;

        //check if title is provided
        if (!title) {
            res.status(400).json({ message: "Title is required" });
            return;
        }

        //check if description is provided
        if (!description) {
            res.status(400).json({ message: "Description is required"});
            return;
        }

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong! Please try again" });
    }
    next();
}