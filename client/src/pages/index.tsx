import { Button } from "@/components/ui/button";
//import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/store/authStore";
import { Link } from "react-router-dom";


export default function Home() {
const user = useAuth((s) => s.user);


return (
<main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-black text-white">
<h1 className="text-5xl font-bold mb-4">Your Stories. Your Voice.</h1>
<p className="text-lg text-gray-300 mb-8 max-w-xl text-center">
A clean, modern blogging space crafted for creators.
</p>


<div className="flex gap-4">
{!user && (
<>
<Link to="/auth/login">
<Button size="lg">Login</Button>
</Link>
<Link to="/auth/register">
<Button variant="secondary" size="lg">Register</Button>
</Link>
</>
)}


{user && (
<Link to="/dashboard">
<Button size="lg">Go to Dashboard</Button>
</Link>
)}
</div>
</main>
);
}