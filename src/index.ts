import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { checkDetails } from "./middlewares/checkDetails.ts";
import { checkUserAndEmail } from "./middlewares/checkUserNameAndEmail.ts";
import { checkPasswordStrength } from "./middlewares/checkPasswordStrength.ts";
import { verifyToken } from "./middlewares/verifyToken.ts";
import { validateBlogDetails } from "./middlewares/validateBlogDetails.ts";
import { register, login, logout } from "./controllers/auth.ts";
import { createBlog, deleteBlog, getBlog, getBlogs, updateBlog } from "./controllers/blogs.ts";


const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express + TS");
});

//add the user route handlers
app.post(
  "/auth/register",
  checkDetails,
  checkUserAndEmail,
  checkPasswordStrength,
  register,
);
//login route handler
app.post("/auth/login", login);
//logout route handler
app.post("/auth/logout", logout);

//blogs route handler
app.post("/blogs", verifyToken, validateBlogDetails, createBlog);
app.get("/blogs", verifyToken, getBlogs);
app.get("/blogs/:id", verifyToken, getBlog);
app.patch("/blogs/:id", verifyToken, updateBlog);
app.patch("/blogs/:id", deleteBlog)


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
