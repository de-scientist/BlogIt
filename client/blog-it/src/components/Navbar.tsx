import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthStore } from "../hooks/useAuthStore";
import api from "../lib/axios";


export default function Navbar() {
const { user, setUser, logoutClient } = useAuthStore();
const router = useRouter();


const handleLogout = async () => {
try {
await api.post("/auth/logout");
logoutClient();
router.push("/");
} catch (err) {
console.error(err);
}
};


return (
<header className="bg-white dark:bg-slate-800 shadow">
<div className="container mx-auto px-4 py-4 flex items-center justify-between">
<Link href="/">
<a className="font-bold">TechBlog</a>
</Link>
<nav className="flex gap-4 items-center">
<Link href="/blogs/list">Blogs</Link>
{user ? (
<>
<Link href="/profile/view">Profile</Link>
<button onClick={handleLogout} className="text-sm">Logout</button>
</>
) : (
<>
<Link href="/auth/login">Login</Link>
<Link href="/auth/register">Register</Link>
</>
)}
</nav>
</div>
</header>
);
}