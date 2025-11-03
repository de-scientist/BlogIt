import { type Request, type Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
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
            res.status(400).json({ message: "Wrong login Credentials"});
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
            userName: user.userName
        };

        //check if password match then return a token and send it to the client as a cookie
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
            expiresIn: "14d",
        });
        res.status(200).cookie("authToken", token).json(payload);
        return;
    } catch (e) {
        res.status(500).json({ message: "Something went wrong! Please try again"});
    }
};