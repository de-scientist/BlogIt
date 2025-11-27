import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { api } from "@/lib/axios";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/profile", { withCredentials: true });
      return res.data;
    },
    onSuccess: (data) => setUser(data),
    onError: () => setUser(null),
    refetchOnWindowFocus: false,
  });

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = () =>
    user
      ? `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase()
      : "";

  return (
    <header className="bg-white dark:bg-slate-900/95 backdrop-blur-md shadow-sm fixed w-full z-50 border-b border-gray-200/50 dark:border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          // Added 'flex items-center space-x-2' to align image and text
          className="flex items-center space-x-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
        >
          {/* 💡 Image Source Added */}
          <img
            src="/path/to/your/logo.png" // **Update this path to your actual logo**
            alt="TechBlog Logo"
            className="h-6 w-6 rounded-full" // Adjust size as needed
            onError={(e) => {
              // Optional: Fallback to hide broken image icon
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <span>TechBlog</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
        
          {/* Blogs Link (Example) */}
          <Link
            to="/blogs/list"
            className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            Blogs
          </Link>

          {/* Authentication Logic */}
          {!isLoading && user ? (
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Link
                to="/profile/view"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {getInitials()}
                </div>
                <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                  Profile
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              // Retained gradient styling for consistency
              className="px-5 py-1.5 rounded-xl bg-blue-600 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-500 transition shadow-sm"
            >
              Get Started
            </button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <HiOutlineXMark
              size={24}
              className="text-gray-700 dark:text-gray-200"
            />
          ) : (
            <HiOutlineBars3
              size={24}
              className="text-gray-700 dark:text-gray-200"
            />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-4 space-y-4">
          <Link
            to="/blogs/list"
            className="block text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
            onClick={() => setMobileOpen(false)}
          >
            Blogs
          </Link>

          {!isLoading && user ? (
            <>
              <Link
                to="/profile/view"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {getInitials()}
                </div>
                <span className="text-gray-800 dark:text-gray-200">
                  Profile
                </span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/auth/login");
                setMobileOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}