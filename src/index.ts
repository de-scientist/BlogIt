import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (_req: Request, res: Response) => { res.send("Welcome to Express + TS"); });

const PORT = 3000; app.listen(PORT, () => { console.log(`App running on port ${PORT}`); }); 