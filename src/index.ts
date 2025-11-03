import express, { type Express, type Request, type Response } from "express";
import { register } from "./controllers/auth.ts";


const app: Express = express();

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express + TS");
});

//add the user route handlers
app.post("/auth/register", register)




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
