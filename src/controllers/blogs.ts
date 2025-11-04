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
