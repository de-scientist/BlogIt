import { Routes, Route } from "react-router-dom";

// pages
import HomePage from "../pages/Home";
import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";
import Dashboard from "@/pages/dashboard";
import CreateBlogPage from "@/pages/dashboard/create";
import TrashPage from "@/pages/dashboard/trash";
import ProfilePage from "@/pages/profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/create" element={<CreateBlogPage />} />
      <Route path="/dashboard/trash" element={<TrashPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
