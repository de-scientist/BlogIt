import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils"; 

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Blog", path: "/dashboard/create" },
    { name: "My Blogs", path: "/dashboard/list" },
    { name: "Blog Trash", path: "/dashboard/trash" },
    { name: "Profile", path: "/profile" },
    { name: "View Profile", path: "/profile/view" },
    { name: "My Blog Posts", path: "/profile/blogs" },
    { name: "My Trash", path: "/profile/trash" },
    { name: "Delete Account", path: "/profile/delete" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-5 sticky top-0">
      <h2 className="text-xl font-bold mb-6">User Panel</h2>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              cn(
                "block px-4 py-2 rounded-md transition",
                isActive
                  ? "bg-green-500 text-black font-semibold"
                  : "hover:bg-gray-700"
              )
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
