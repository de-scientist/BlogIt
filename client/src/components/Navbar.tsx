import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { api } from "@/lib/axios";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { User, LogOut, Loader2 } from "lucide-react";

// 💡 Define a type for the user data to fix 'Parameter 'data' implicitly has an 'any' type.'
// Adjust these fields based on what your /profile endpoint actually returns.
type UserType = {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  // Add other properties your API returns
};

export default function Navbar() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // --- Fetch Current User Status ---
  // 💡 FIX 1: Explicitly define the generic types for useQuery: <Data, Error, SelectData, QueryKey>
  // We specify <UserType, Error, UserType, string[]>
  const { isLoading } = useQuery<UserType, Error, UserType, string[]>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get<UserType>("/profile", { withCredentials: true }); // 💡 Use UserType generic on axios
      return res.data;
    },
    
    // 💡 FIX 2: Use the 'select' function (the modern equivalent) to handle data transformation/side effects.
    // The 'onSuccess' functionality is integrated here, ensuring the data passed to setUser is correctly typed.
    select: (data) => {
      setUser(data);
      return data;
    },

    // 💡 Fallback for the error case
    onError: () => setUser(null),
    refetchOnWindowFocus: false,
    // initialData: {} as UserType, // Only needed if you want initial data structure
  });

  // --- Handle Logout (Unchanged) ---
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // --- Utility for Initials (Unchanged) ---
  const getInitials = () =>
    user
      ? `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase()
      : "";

  // --- JSX (UI/UX) - Unchanged from previous response ---
  return (
    <header className="bg-white dark:bg-slate-900/95 backdrop-blur-md shadow-lg fixed w-full z-50 border-b border-gray-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* 1. Logo (Branding Update) */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text hover:opacity-90 transition"
        >
          TechBlog
        </Link>

        {/* 2. Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          
          {/* Primary Navigation Link */}
          <Link
            to="/blogs/list"
            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition duration-200"
          >
            Browse Blogs
          </Link>

          {/* 3. Authentication Logic */}
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
          ) : user ? (
            <div className="flex items-center gap-3 border-l pl-4 border-gray-300 dark:border-slate-700">
              {/* Profile Link with Name and Avatar */}
              <Link
                to="/profile/view"
                className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-purple-500/30">
                  {getInitials()}
                </div>
                <span className="text-gray-900 dark:text-gray-100 text-base font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition hidden lg:inline">
                  {user.userName || user.firstName}
                </span>
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-purple-500 transition" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="px-5 py-2 rounded-xl font-semibold 
                            bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                            shadow-lg shadow-purple-500/30 hover:opacity-90 transition-all"
            >
              Get Started / Login
            </button>
          )}
        </nav>

        {/* 4. Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <HiOutlineXMark
              size={28}
              className="text-gray-900 dark:text-gray-100"
            />
          ) : (
            <HiOutlineBars3
              size={28}
              className="text-gray-900 dark:text-gray-100"
            />
          )}
        </button>
      </div>

      {/* 5. Mobile dropdown (Improved UX) */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-4 py-4 space-y-3">
          
          <Link
            to="/blogs/list"
            className="block w-full text-lg font-medium text-gray-800 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            onClick={() => setMobileOpen(false)}
          >
            Browse Blogs
          </Link>

          {!isLoading && user ? (
            <>
              {/* Profile Link */}
              <Link
                to="/profile/view"
                onClick={() => setMobileOpen(false)}
                className="flex items-center w-full gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-base font-bold shadow-sm">
                  {getInitials()}
                </div>
                <div className="text-left">
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">{user.userName || user.firstName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View Profile</p>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full text-lg font-medium text-left px-3 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/auth/login");
                setMobileOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-lg font-semibold 
                            bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                            shadow-lg shadow-purple-500/30 hover:opacity-90 transition-all"
            >
              Get Started / Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}