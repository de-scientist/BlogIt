import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiChevronDown,
} from "react-icons/hi2";

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Collapsible groups
  const [openGroup, setOpenGroup] = useState<string>("Main");

  // Avatar dropdown state
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Fake user data — replace with real API later
  const user = {
    name: "Mark K.",
    email: "gitaumark502@gmail.com",
    avatar:
      "https://ui-avatars.com/api/?name=Mark+K&background=8b5cf6&color=fff",
  };

  // Load saved sidebar group
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-group");
    if (saved) setOpenGroup(saved);
  }, []);

  const toggleGroup = (title: string) => {
    const newState = openGroup === title ? "" : title;
    setOpenGroup(newState);
    localStorage.setItem("sidebar-group", newState);
  };

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    navigate("/auth/logout");
  };

  // -------------------------
  // GROUPED LINKS (unchanged)
  // -------------------------

  const groupedLinks = [
    {
      title: "Main",
      items: [{ name: "Dashboard", path: "/dashboard" }],
    },
    {
      title: "Blog Management",
      items: [
        { name: "Create Blog", path: "/blogs/create" },
        { name: "My Blogs", path: "/blogs/list" },
        { name: "Blog Trash", path: "/blogs/trash" },
      ],
    },
    {
      title: "Profile Management",
      items: [
        { name: "Profile", path: "/profile" },
        { name: "View Profile", path: "/profile/view" },
        { name: "My Blog Posts", path: "/profile/blogs" },
        { name: "My Trash", path: "/profile/trash" },
        { name: "Delete Account", path: "/profile/delete" },
      ],
    },
  ];

  const SidebarSection = ({ group }: any) => (
    <div className="flex flex-col">
      <button
        onClick={() => toggleGroup(group.title)}
        className="flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400"
      >
        <span>{group.title}</span>

        <HiChevronDown
          size={18}
          className={cn(
            "transition-transform duration-300",
            openGroup === group.title && "rotate-180"
          )}
        />
      </button>

      {/* Expandable */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          openGroup === group.title ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-2 pt-2 pb-3">
          {group.items.map((link: any) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide text-left transition-all duration-300 shadow-sm relative",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );

  const AvatarSection = () => (
    <div className="relative mb-8" ref={avatarRef}>
      {/* Avatar Button */}
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all w-full"
        onClick={() => setAvatarOpen(!avatarOpen)}
      >
        <img
          src={user.avatar}
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
        />

        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {user.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>

        <HiChevronDown
          size={18}
          className={cn(
            "ml-auto transition-transform",
            avatarOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {avatarOpen && (
        <div className="absolute mt-2 w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 animate-fadeIn">
          <button
            onClick={() => navigate("/profile/view")}
            className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition"
          >
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );

  const SidebarContent = () => (
    <nav className="flex flex-col gap-4">
      <AvatarSection />
      {groupedLinks.map((group) => (
        <SidebarSection key={group.title} group={group} />
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-50 dark:bg-slate-900 p-6 h-screen sticky top-0 shadow-md">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white">
            User Panel
          </h2>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-50 dark:bg-slate-900 px-4 py-4 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Panel
        </h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition"
        >
          {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-50">
          <div className="fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-slate-900 p-6 shadow-lg overflow-y-auto animate-slideIn">
            <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white">
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
