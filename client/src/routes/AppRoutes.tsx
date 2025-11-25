import { Routes, Route } from "react-router-dom";

// pages
import Home from "@/pages";
import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";

import Dashboard from "@/pages/dashboard";
import CreateBlogPage from "@/pages/dashboard/create";
import BlogList from "@/pages/blogs/List";
//import TrashPage from "@/pages/dashboard/trash";

import ProfilePage from "@/pages/profile";               // update profile
import ViewProfilePage from "@/pages/profile/View";      // view profile
import UserBlogsPage from "@/pages/profile/UserBlogs";   // user's blogs
import TrashPage from "@/pages/dashboard/trash";     // user trash
import DeleteProfilePage from "@/pages/profile/DeleteProfilePage";  // soft delete
import PermanentDeleteUserPage from "@/pages/profile/PermantDeleteUserPage";// hard delete

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/create" element={<CreateBlogPage />} />
      <Route path="/dashboard/list" element={<BlogList />} />
      

      {/* Profile & User Management */}
      <Route path="/profile" element={<ProfilePage />} />                 {/* update */}
      <Route path="/profile/view" element={<ViewProfilePage />} />        {/* read */}
      <Route path="/profile/blogs" element={<UserBlogsPage />} />         {/* user blogs */}
      <Route path="/profile/trash" element={<TrashPage />} />         {/* user trash */}
      <Route path="/profile/delete" element={<DeleteProfilePage />} />    {/* soft delete */}
      <Route
        path="/profile/delete/permanent/:id"
        element={<PermanentDeleteUserPage />}
      />

    </Routes>
  );
}
