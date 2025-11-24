import { Routes, Route } from "react-router-dom";

// pages
import HomePage from "../pages/Home";
import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";
import DashboardPage from "../dashboard/DashboardPage";
import CreateBlogPage from "../dashboard/create";
import TrashPage from "../dashboard/trash";
import ProfilePage from "@/pages/profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/create" element={<CreateBlogPage />} />
      <Route path="/dashboard/trash" element={<TrashPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
