import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Blog", path: "/blogs/create" },
    { name: "My Blogs", path: "/blogs/list" },
    { name: "Blog Trash", path: "/blogs/trash" },
    { name: "Profile", path: "/profile" },
    { name: "View Profile", path: "/profile/view" },
    { name: "My Blog Posts", path: "/profile/blogs" },
    { name: "My Trash", path: "/profile/trash" },
    { name: "Delete Account", path: "/profile/delete" },
  ];

  const SidebarContent = () => (
    <nav className="flex flex-col gap-2">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              "block px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide text-left transition-all duration-300 shadow-sm relative",

              // ACTIVE
              isActive
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg before:absolute before:-inset-1 before:rounded-lg before:bg-gradient-to-r before:from-purple-400 before:to-pink-400 before:opacity-40 before:blur-xl"
                : // INACTIVE
                  "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white",
            )
          }
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 h-screen p-6 sticky top-0 shadow-md">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-8 text-gray-900 dark:text-white">
            User Panel
          </h2>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-50 dark:bg-slate-900 px-4 py-4 shadow-md">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          User Panel
        </h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition"
        >
          {mobileOpen ? (
            <HiOutlineXMark size={24} />
          ) : (
            <HiOutlineBars3 size={24} />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-50">
          <div className="fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-slate-900 p-6 shadow-lg overflow-y-auto animate-slideIn">
            <h2 className="text-xl font-semibold tracking-tight mb-8 text-gray-900 dark:text-white">
              User Panel
            </h2>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Slide-in animation */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </>
  );
}
