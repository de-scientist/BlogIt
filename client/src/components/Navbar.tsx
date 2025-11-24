import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";
import { api } from "@/lib/axios";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/"); // redirect to home
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          TechBlog
        </Link>
        <nav className="flex gap-4 items-center">
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
                className="text-sm px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-700"
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
      </div>
    </header>
  );
}
