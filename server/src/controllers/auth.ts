import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient, User } from "@prisma/client";

const client = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, userName, emailAddress, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 11);

    await client.user.create({
      data: {
        firstName,
        lastName,
        userName,
        emailAddress,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (e: any) {
    if (e.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    res
      .status(500)
      .json({ message: "Something went wrong! Please try again." });
  }
};

//export the login controller function
export const login = async (req: Request, res: Response) => {
  try {
    //get the identifier and password
    const { identifier, password } = req.body;

    //get the user whose username or email address match the identifier
    const user = await client.user.findFirst({
      where: {
        OR: [{ emailAddress: identifier }, { userName: identifier }],
      },
    });

    //check if we find user then if not return message- wrong credentials
    if (!user) {
      res.status(400).json({ message: "Wrong login Credentials" });
      return;
    }

    //compare stored user password with the given password
    const passwordMatch = await bcrypt.compare(password, user.password);

    //check if password match and if not message -- wrong credentials
    if (!passwordMatch) {
      res.status(400).json({ message: "Wrong login credentials" });
      return;
    }

    //check if password match then - login success - prepare payload
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      userName: user.userName,
    };

    //check if password match then return a token and send it to the client as a cookie
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "14d",
    });
    res.status(200).cookie("authToken", token).json(payload);
    return;
  } catch (e) {
    res.status(500).json({ message: "Something went wrong! Please try again" });
  }
};

//export the logout controller function
export const logout = (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .clearCookie("authToken")
      .json({ message: "You've logged out successfully" });
    return;
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong! Kindly try again." });
  }
};

//update user's password
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    //fetch user
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //compare the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    //hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 11);

    //update password
    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Kindly try again." });
  }
};
