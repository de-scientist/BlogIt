import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { checkDetails } from "./middlewares/checkDetails.ts";
import { checkUserAndEmail } from "./middlewares/checkUserNameAndEmail.ts";
import { checkPasswordStrength } from "./middlewares/checkPasswordStrength.ts";
import { verifyToken } from "./middlewares/verifyToken.ts";
import { validateBlogDetails } from "./middlewares/validateBlogDetails.ts";
import { register, login, logout, updatePassword } from "./controllers/auth.ts";
import {
  createBlog,
  getBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  permanentDeleteBlog,
  trash,
  recoverDeletedBlog,
} from "./controllers/blogs.ts";
import {
  deleteProfile,
  getUserBlogs,
  getUserProfile,
  getUserTrash,
  permanentDeleteUser,
  updateProfile,
} from "./controllers/users.ts";

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
//update password route handler
app.patch("/auth/password", verifyToken, checkPasswordStrength, updatePassword);

//blogs route handler
app.post("/blogs", verifyToken, validateBlogDetails, createBlog);
app.get("/blogs", verifyToken, getBlogs);
app.get("/blogs/:id", verifyToken, getBlog);
app.get("/blogs/trash", verifyToken, trash);
app.patch("/blogs/:id", verifyToken, updateBlog);
app.patch("/blogs/trash/:id", verifyToken, deleteBlog);
app.patch("/blogs/recover/:id", verifyToken, recoverDeletedBlog);
app.delete("/blogs/:id", verifyToken, permanentDeleteBlog);

//user route handlers
app.get("/profile", verifyToken, getUserProfile);
app.patch("/profile", verifyToken, checkUserAndEmail, updateProfile);
app.get("/profile/blogs", verifyToken, getUserBlogs);
app.patch("/users/delete", verifyToken, deleteProfile);
app.get("/profile/trash", verifyToken, getUserTrash);
app.delete("/users/delete/:id", verifyToken, permanentDeleteUser);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
