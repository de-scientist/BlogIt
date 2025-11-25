import { Routes, Route } from "react-router-dom";

// pages
import Home from "@/pages";
import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";

// Dashboard / Blogs
import Dashboard from "@/pages/dashboard";
import CreateBlog from "@/pages/blogs/CreateBlog";
import EditBlog from "@/pages/blogs/EditBlog";
import BlogList from "@/pages/blogs/BlogList";
import BlogView from "@/pages/blogs/BlogView";
import Trash from "@/pages/blogs/Trash";

// Profile & User Management
import ProfilePage from "@/pages/profile";               // update profile
import ViewProfilePage from "@/pages/profile/View";      // view profile
import UserBlogsPage from "@/pages/profile/UserBlogsPage"; // user's blogs
import DeleteProfilePage from "@/pages/profile/DeleteProfilePage";  // soft delete
import PermanentDeleteUserPage from "@/pages/profile/PermantDeleteUserPage"; // hard delete

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Dashboard / Blogs */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/blogs" element={<BlogList />} />                 {/* all blogs */}
      <Route path="/dashboard/blogs/create" element={<CreateBlog />} />       {/* create blog */}
      <Route path="/dashboard/blogs/edit/:id" element={<EditBlog />} />       {/* edit blog */}
      <Route path="/dashboard/blogs/view/:id" element={<BlogView />} />       {/* view single blog */}
      <Route path="/dashboard/blogs/trash" element={<Trash />} />             {/* deleted blogs */}

      {/* Profile & User Management */}
      <Route path="/profile" element={<ProfilePage />} />                     {/* update profile */}
      <Route path="/profile/view" element={<ViewProfilePage />} />           {/* view profile */}
      <Route path="/profile/blogs" element={<UserBlogsPage />} />             {/* user's blogs */}
      <Route path="/profile/trash" element={<Trash />} />                     {/* user trash */}
      <Route path="/profile/delete" element={<DeleteProfilePage />} />       {/* soft delete */}
      <Route
        path="/profile/delete/permanent/:id"
        element={<PermanentDeleteUserPage />}
      />                                                                      {/* hard delete */}
    </Routes>
  );
}
