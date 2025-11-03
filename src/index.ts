import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { checkDetails } from "./middlewares/checkDetails.ts";
import { checkUserAndEmail } from "./middlewares/checkUserNameAndEmail.ts";
import { checkPasswordStrength } from "./middlewares/checkPasswordStrength.ts";
import { login, register } from "./controllers/auth.ts";



const app = express();
dotenv.config();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express + TS");
});

//add the user route handlers
app.post("/auth/register",checkDetails, checkUserAndEmail, checkPasswordStrength, register);
//login route handler
app.post("/auth/login", login);




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
