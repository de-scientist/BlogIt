import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Middlewares
import { checkDetails } from "./middlewares/checkDetails.ts";
import { checkUserAndEmail } from "./middlewares/checkUserNameAndEmail.ts";
import { checkPasswordStrength } from "./middlewares/checkPasswordStrength.ts";
import { verifyToken } from "./middlewares/verifyToken.ts";
import { validateBlogDetails } from "./middlewares/validateBlogDetails.ts";

// Controllers
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

dotenv.config();
const app: Express = express();

// --------------------
// Middleware Setup
// --------------------
app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  credentials: true,              // allow cookies to be sent
}));

// --------------------
// Basic Route
// --------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express + TS API");
});

// --------------------
// API Prefix
// --------------------
const api = "/api";

// --------- AUTH ---------
app.post(`${api}/auth/register`, checkDetails, checkUserAndEmail, checkPasswordStrength, register);
app.post(`${api}/auth/login`, login);
app.post(`${api}/auth/logout`, logout);
app.patch(`${api}/auth/password`, verifyToken, checkPasswordStrength, updatePassword);

// --------- BLOGS ---------
app.post(`${api}/blogs`, verifyToken, validateBlogDetails, createBlog);
app.get(`${api}/blogs`, verifyToken, getBlogs);
app.get(`${api}/blogs/:id`, verifyToken, getBlog);
app.get(`${api}/blogs/trash`, verifyToken, trash);
app.patch(`${api}/blogs/:id`, verifyToken, updateBlog);
app.patch(`${api}/blogs/trash/:id`, verifyToken, deleteBlog);
app.patch(`${api}/blogs/recover/:id`, verifyToken, recoverDeletedBlog);
app.delete(`${api}/blogs/:id`, verifyToken, permanentDeleteBlog);

// --------- USER PROFILE ---------
app.get(`${api}/profile`, verifyToken, getUserProfile);
app.patch(`${api}/profile`, verifyToken, checkUserAndEmail, updateProfile);
app.get(`${api}/profile/blogs`, verifyToken, getUserBlogs);
app.patch(`${api}/users/delete`, verifyToken, deleteProfile);
app.get(`${api}/profile/trash`, verifyToken, getUserTrash);
app.delete(`${api}/users/delete/:id`, verifyToken, permanentDeleteUser);

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
