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

  // Generate user initials for avatar
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.charAt(0).toUpperCase() || "";
    const last = user.lastName?.charAt(0).toUpperCase() || "";
    return first + last;
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

          {!isLoading && user ? (
            <>
              <Link to="/profile/view" className="hover:underline flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {getInitials()}
                </div>
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
          {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
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

          {!isLoading && user ? (
            <>
              <Link
                to="/profile/view"
                className="block hover:underline flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {getInitials()}
                </div>
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
