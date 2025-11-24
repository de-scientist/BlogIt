import { Routes, Route } from "react-router-dom";

// pages
import Home from "@/pages";
import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard";
import CreateBlogPage from "@/pages/dashboard/create";
import TrashPage from "@/pages/dashboard/trash";
import ProfilePage from "@/pages/profile";
import BlogList from "@/pages/blogs/List"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/create" element={<CreateBlogPage />} />
      <Route path="/dashboard/trash" element={<TrashPage />} />
      <Route path="/dashboard/list" element={<BlogList />} /> 
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
