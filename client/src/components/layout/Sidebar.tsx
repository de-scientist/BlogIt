import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
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

  const [openGroup, setOpenGroup] = useState<string>("Main");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // SAFE react-query profile loader
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile", { withCredentials: true })).data,
    placeholderData: {
      name: "Loading...",
      email: "Loading...",
      avatar: null,
    },
  });

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

  // Close avatar dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => navigate("/auth/logout");

  // Links (unchanged)
  const groupedLinks = [
    {
      title: "Main",
      items: [{ name: "Dashboard", path: "/dashboard" }],
    },
    {
      title: "Blog Management",
      items: [
        { name: "Create Blog", path: "/blogs/create" },
        { name: "My Blogs", path: "/blogs/view" },
        { name: "Blog Trash", path: "/blogs/trash" },
      ],
    },
    {
      title: "Profile Management",
      items: [
        { name: "Profile", path: "/profile" },
        { name: "View Profile", path: "/profile/view" },
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

  const AvatarSection = () => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0]?.toUpperCase())
        .join("")
    : "U";

  // Skeleton
  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-3 px-4 py-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-slate-700" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 bg-gray-300 dark:bg-slate-700 rounded" />
          <div className="h-3 w-32 bg-gray-300 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  // Error
  if (isError || !user) {
    return (
      <div className="p-4 mb-8 bg-red-100 text-red-700 rounded-lg">
        Failed to load profile
      </div>
    );
  }

    return (
    <div className="relative mb-8" ref={avatarRef}>
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 
        hover:bg-gray-200 dark:hover:bg-slate-700 transition-all w-full shadow-sm"
        onClick={() => setAvatarOpen(!avatarOpen)}
      >
        {/* SHADCN AVATAR */}
        <Avatar className="h-10 w-10 border-2 border-purple-500/60 shadow-md">
          <AvatarImage src={undefined} />
          <AvatarFallback className="bg-purple-600 text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>

        <HiChevronDown
          size={18}
          className={cn(
            "ml-auto transition-transform text-purple-600 dark:text-purple-400",
            avatarOpen && "rotate-180"
          )}
        />
      </button>

      {avatarOpen && (
        <div
          className="absolute mt-2 w-full bg-gray-50 dark:bg-slate-900 
          border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg 
          p-4 animate-fadeIn"
        >
          <div className="pb-3 mb-3 border-b border-gray-300/40 dark:border-gray-700/40">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Member since: Jan 2025
            </p>
          </div>

          <button
            onClick={() => navigate("/profile/view")}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md 
            text-sm transition hover:bg-gray-200 
            dark:hover:bg-slate-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md 
            text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};


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
      {/* Desktop */}
      <aside className="hidden md:flex w-64 bg-gray-50 dark:bg-slate-900 p-6 h-screen sticky top-0 shadow-md">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white">
            User Panel
          </h2>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile */}
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

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out forwards;
          }
        `}
      </style>
    </>
  );
}
