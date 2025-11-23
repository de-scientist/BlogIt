import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

//get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        firstName: true,
        lastName: true,
        emailAddress: true,
        userName: true,
      },
    });
    //check if the profile is available
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong! Kindly try again." });
  }
};

//update the user's profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, userName, emailAddress } = req.body;
    const userId = req.user.id;

    await client.user.update({
      where: {
        id: userId,
        isDeleted: false,
      },
      data: {
        firstName: firstName && firstName,
        lastName: lastName && lastName,
        userName: userName && userName,
        emailAddress: emailAddress && emailAddress,
      },
    });
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong! Kindly try again." });
  }
};

//delete the user profile (soft deletion)
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        isDeleted: true,
      },
    });
    return res
      .status(200)
      .json({ message: "User profile deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong! Kindly, try again." });
  }
};

//permanently delete a user
export const permanentDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await client.user.delete({
      where: {
        id: String(id),
      },
    });
    return res
      .status(200)
      .json({ message: "User profile deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong! Kindly, try again." });
  }
};

//get blogs by user
export const getUserBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const blogs = await client.blog.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        title: true,
        synopsis: true,
        featuredImageUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found for this user." });
    }
    return res.status(200).json({ blogs });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Kindly try again." });
  }
};

//get user's trash
export const getUserTrash = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const blogs = await client.blog.findMany({
      where: {
        userId,
        isDeleted: true,
      },
      select: {
        title: true,
        synopsis: true,
        featuredImageUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    //check if there are blogs in the trash
    if (!blogs.length) {
      return res.status(200).json({ message: "Trash is empty." });
    }
    return res.status(200).json({ blogs });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Kindly try again." });
  }
};
