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
  HiOutlineViewColumns,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineChevronDoubleLeft, // New icon for collapse
  HiOutlineHome,
} from "react-icons/hi2";
import { LogOut } from "lucide-react"; // Imported LogOut for the dropdown

// Define the UserType (Assuming these fields exist in your API response)
type UserType = {
  name: string;
  email: string;
  avatar?: string; // profile image URL
  joinedDate?: string; // Added for professional touch
};

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // New state for collapse
  const [openGroup, setOpenGroup] = useState<string>("Main");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching ---
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["profile"],
    queryFn: async () =>
      (await api.get("/profile", { withCredentials: true })).data,
    // Adjusted placeholder for consistency and type safety
    placeholderData: {
      name: "Loading...",
      email: "Loading...",
      avatar: undefined,
      joinedDate: "",
    },
  });

  // Load saved sidebar group
  useEffect(() => {
    const savedGroup = localStorage.getItem("sidebar-group");
    if (savedGroup) setOpenGroup(savedGroup);
    
    // Load saved collapse state
    const savedCollapse = localStorage.getItem("sidebar-collapsed");
    if (savedCollapse) setIsCollapsed(savedCollapse === "true");

  }, []);

  const toggleGroup = (title: string) => {
    const newState = openGroup === title ? "" : title;
    setOpenGroup(newState);
    localStorage.setItem("sidebar-group", newState);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("sidebar-collapsed", String(!isCollapsed));
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

  // Links with Icons for better UX
  const groupedLinks = [
    {
      title: "Main",
      items: [{ name: "Dashboard", path: "/dashboard", icon: HiOutlineHome }],
    },
    {
      title: "Blog Management",
      items: [
        { name: "Create Blog", path: "/blogs/create", icon: HiOutlinePencilSquare },
        { name: "My Blogs", path: "/dashboard/blogs", icon: HiOutlineViewColumns },
        { name: "Blog Trash", path: "/profile/trash", icon: HiOutlineTrash },
      ],
    },
    {
      title: "Profile Management",
      items: [
        { name: "Account Settings", path: "/profile", icon: HiOutlineUser },
        { name: "View Public Profile", path: "/profile/view", icon: HiOutlineShieldCheck },
        { name: "Delete Account", path: "/profile/delete", icon: HiOutlineTrash },
      ],
    },
  ];

  const SidebarSection = ({ group }: { group: (typeof groupedLinks)[0] }) => (
    <div className="flex flex-col">
      <button
        onClick={() => toggleGroup(group.title)}
        className={cn(
          "flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wider transition-colors",
          isCollapsed ? "px-3" : "px-4",
          openGroup === group.title
            ? "text-purple-600 dark:text-purple-400"
            : "text-gray-500 dark:text-gray-400 hover:text-purple-500"
        )}
        disabled={isCollapsed} // Disable collapse if collapsed (just visually)
      >
        {!isCollapsed && <span>{group.title}</span>}

        {!isCollapsed && (
          <HiChevronDown
            size={18}
            className={cn(
              "transition-transform duration-300",
              openGroup === group.title && "rotate-180"
            )}
          />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          openGroup === group.title && !isCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          isCollapsed && "max-h-full opacity-100" // Always show links if collapsed, ignoring the group toggle
        )}
      >
        <div className="flex flex-col gap-1 pt-1 pb-3">
          {group.items.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-200",
                    isCollapsed ? "px-3 justify-center" : "px-4",
                    isActive
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-800/80"
                  )
                }
              >
                <Icon size={20} className={cn(isCollapsed ? "mx-auto" : "flex-shrink-0")} />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );

  const AvatarSection = () => {
    const initials = user?.name
      ? user.name
          .split(" ")
          .slice(0, 2) // Limit to first two words for initials
          .map((n: string) => n[0]?.toUpperCase())
          .join("")
      : "U";

    // Skeleton
    if (isLoading) {
      return (
        <div className={cn("animate-pulse flex items-center gap-3 py-2 mb-6", isCollapsed ? "justify-center" : "px-4")}>
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-slate-700" />
          {!isCollapsed && (
            <div className="flex flex-col gap-1">
              <div className="h-3 w-20 bg-gray-300 dark:bg-slate-700 rounded" />
              <div className="h-3 w-28 bg-gray-300 dark:bg-slate-700 rounded" />
            </div>
          )}
        </div>
      );
    }

    // Error
    if (isError || !user) {
      return (
        <div className="p-3 mb-6 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm rounded-lg">
          Failed to load profile
        </div>
      );
    }

    return (
      <div className="relative mb-6" ref={avatarRef}>
        <button
          className={cn(
            "flex items-center gap-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shadow-sm w-full",
            isCollapsed ? "justify-center px-0 h-14" : "px-4"
          )}
          onClick={() => setAvatarOpen(!avatarOpen)}
          disabled={isCollapsed} // Disable dropdown button when collapsed
        >
          {/* SHADCN AVATAR */}
          <Avatar className="h-10 w-10 border-2 border-purple-500/60 shadow-md flex-shrink-0">
            {/* Use the actual avatar image */}
            <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} /> 
            <AvatarFallback className="bg-purple-600 text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="text-left flex-grow truncate">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <HiChevronDown
              size={18}
              className={cn(
                "ml-auto transition-transform text-purple-600 dark:text-purple-400",
                avatarOpen && "rotate-180"
              )}
            />
          )}
        </button>

        {avatarOpen && (
          <div
            className="absolute mt-2 w-full bg-gray-50 dark:bg-slate-900 
            border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl 
            p-3 z-10 animate-fadeIn"
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {user.name}
            </p>
            <div className="border-b border-gray-300/40 dark:border-gray-700/40 pb-2 mb-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{user.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Member since: {user.joinedDate || 'N/A'}
              </p>
            </div>

            {/* View Profile Button */}
            <button
              onClick={() => navigate("/profile/view")}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md 
              text-sm transition text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <HiOutlineUser className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              View Profile
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md 
              text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
            >
              <LogOut className="h-5 w-5" />
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
      <div className="space-y-1">
        {groupedLinks.map((group) => (
          <SidebarSection key={group.title} group={group} />
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex bg-gray-50 dark:bg-slate-900 p-4 h-screen sticky top-0 shadow-xl transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="w-full">
          
          {/* Header and Collapse Button */}
          <div className={cn("flex items-center mb-6", isCollapsed ? "justify-center" : "justify-between")}>
            {!isCollapsed && (
              <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                DASHBOARD
              </p>
            )}
            <button
              onClick={toggleCollapse}
              className={cn(
                "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition",
                !isCollapsed && "ml-auto"
              )}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <HiOutlineChevronDoubleLeft 
                size={20} 
                className={cn(
                  "text-gray-600 dark:text-gray-300 transition-transform duration-300",
                  isCollapsed && "rotate-180"
                )}
              />
            </button>
          </div>
          
          {/* Sidebar Content */}
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Header (Adjusted to look more like a header and less like a stand-alone panel) */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Welcome back, 
          <strong className="text-gray-900 dark:text-white ml-1">{user?.name || "User"}!</strong>
        </p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle Mobile Menu"
        >
          {mobileOpen ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={() => setMobileOpen(false)}>
          <div 
            className="fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-slate-900 p-4 shadow-2xl overflow-y-auto animate-slideIn" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                DASHBOARD
              </p>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                title="Close Menu"
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>
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