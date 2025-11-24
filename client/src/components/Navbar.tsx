import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { api } from "@/lib/axios";
import { HiMenu, HiX } from "react-icons/hi2";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          TechBlog
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/blogs/list" className="hover:underline">
            Blogs
          </Link>
          {user ? (
            <>
              <Link to="/profile/view" className="hover:underline">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hover:underline">
                Login
              </Link>
              <Link to="/auth/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 px-4 pb-4 space-y-2">
          <Link
            to="/blogs/list"
            className="block hover:underline"
            onClick={() => setMobileOpen(false)}
          >
            Blogs
          </Link>
          {user ? (
            <>
              <Link
                to="/profile/view"
                className="block hover:underline"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="block hover:underline"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="block hover:underline"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
