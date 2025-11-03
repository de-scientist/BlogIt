import { type Request, type Response } from "express";
import { PrismaClient, User } from "@prisma/client";
//import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
                password: hashedPassword
            },
        });
        res.status(201).json({ message: "User registered successfully" });
    } catch (e: any) {
        if (e.code === "P2002")
        {
return res.status(409).json({ message: "Username or email already exists"
});
        }
         res.status(500).json({ message: "Something went wrong! Please try again."});   
        
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
                OR: [{ emailAddress: identifier }, { userName: identifier }]
            },
        });

        //check if we find user then if not return message- wrong credentials
        if (!user) {
            res.status(400).json({ message: "Wrong Credentials"});
            return;
        }

        

    } catch (e) {
        
    }
}