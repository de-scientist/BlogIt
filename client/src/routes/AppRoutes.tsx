import { Routes, Route } from "react-router-dom";

// 💡 NEW IMPORTS: Layout Components (Required to be correct)
import Layout from "@/components/Layout";
import NoSidebarLayout from "@/components/NoSidebarLayout";

// pages
import Home from "@/pages";
import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import LogoutPage from "@/pages/auth/LogOut";
import UpdatePasswordPage from "@/pages/auth/UpdatePasswordPage";

// Dashboard / Blogs
import Dashboard from "@/pages/dashboard";
import CreateBlog from "@/pages/blogs/CreateBlog";
import EditBlog from "@/pages/blogs/EditBlog";
import BlogList from "@/pages/blogs/BlogList";
import BlogView from "@/pages/blogs/BlogView";
import Trash from "@/pages/blogs/Trash";

// Profile & User Management
import ProfilePage from "@/pages/profile"; 
import ViewProfilePage from "@/pages/profile/View"; 
import EditProfilePage from "@/pages/profile/EditProfilePage"; 
import UserBlogsPage from "@/pages/profile/UserBlogsPage"; 
import DeleteProfilePage from "@/pages/profile/DeleteProfilePage"; 
import PermanentDeleteUserPage from "@/pages/profile/PermantDeleteUserPage"; 

// New experience for new users
import ContactUs from "@/pages/ContactUs";
import Inspiration from "@/pages/Inspiration";
import InspirationSingle from "@/pages/InspirationSingle";

export default function AppRoutes() {
  return (
    <Routes>
      {/* -------------------------------------------------- */}
      {/* ## 1. Routes with NO Sidebar (Home, Auth, Info Pages) 🚫 */}
      <Route element={<NoSidebarLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/logout" element={<LogoutPage />} />
        <Route path="/auth/password" element={<UpdatePasswordPage />} />

        {/* New Pages */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/inspiration/:id" element={<InspirationSingle />} />
      </Route>
      {/* -------------------------------------------------- */}

      {/* -------------------------------------------------- */}
      {/* ## 2. Routes WITH Sidebar (Dashboard, Blogs, Profile) 🧭 */}
      <Route element={<Layout />}>
        {/* Dashboard / Blogs */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/blogs" element={<BlogList />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/blogs/edit/:id" element={<EditBlog />} />
        <Route path="/blogs/view/:id" element={<BlogView />} />
        <Route path="/blogs/trash" element={<Trash />} />

        {/* Profile & User Management */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/view" element={<ViewProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/blogs" element={<UserBlogsPage />} />
        <Route path="/profile/trash" element={<Trash />} />
        <Route path="/profile/delete" element={<DeleteProfilePage />} />
        <Route
          path="/profile/delete/permanent/:id"
          element={<PermanentDeleteUserPage />}
        />
      </Route>
      {/* -------------------------------------------------- */}
    </Routes>
  );
}