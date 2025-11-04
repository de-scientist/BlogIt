import { type Request, type Response, type NextFunction } from "express";

export const validateBlogDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, synopsis, featuredImageUrl, content } = req.body;

        //check if title is provided
        if (!title) {
            res.status(400).json({ message: "Title is required" });
            return;
        }

        //check if synopsis is provided
        if (!synopsis) {
            res.status(400).json({ message: "Synopsis is required"});
            return;
        }

        //check if featuredImageUrl is provided
        if (!featuredImageUrl) {
            res.status(400).json({ message: "Featured Image Url is required"});
            return;
        }

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong! Please try again" });
    }
    next();
}