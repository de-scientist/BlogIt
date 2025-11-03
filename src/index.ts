import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import { checkDetails } from "./middlewares/checkDetails.ts";
import { register } from "./controllers/auth.ts";



const app = express();
dotenv.config();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express + TS");
});

//add the user route handlers
app.post("/auth/register",checkDetails, register)




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
