import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

//create a blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, synopsis, featuredImageUrl, content } = req.body;

    await client.blog.create({
      data: {
        title,
        synopsis,
        featuredImageUrl,
        content,
        userId: req.user.id,
      },
    });
    res.status(201).json({ message: "Blog created successfully" });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong! Kindly try again." });
  }
};

//get all blogs
export const getBlogs = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const blogs = await client.blog.findMany({
            where: {
                userId,
                isDeleted: false,
            },
        });
        res.status(200).json({ blogs });
        return;
    } catch (error) {
        res.status(500).json({ message: "Something went wrong! Kindly try again."});
        return;
    }
};

//get a single blog
export const getBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const blog = await client.blog.findFirst({
            where: {
                id: String(id),
                userId,
                isDeleted: false,
            },
        });

        //check if there is a blog
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
    } catch (error) {
        
    }
}
