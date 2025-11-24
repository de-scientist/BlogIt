import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/authStore";


export default function Login() {
const login = useAuth((s) => s.login);
const loading = useAuth((s) => s.loading);


const [identifier, setIdentifier] = useState("");
const [password, setPassword] = useState("");


const handleSubmit = async (e: any) => {
e.preventDefault();
await login(identifier, password);
};


return (
<div className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
<Card className="w-full max-w-md p-4 shadow-xl">
<CardContent>
<h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
<form className="space-y-4" onSubmit={handleSubmit}>
<div className="space-y-2">
<Label>Username or Email</Label>
<Input
value={identifier}
onChange={(e) => setIdentifier(e.target.value)}
placeholder="Enter your username or email"
/>
</div>


<div className="space-y-2">
<Label>Password</Label>
<Input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Enter your password"
/>
</div>


<Button className="w-full" disabled={loading}>
{loading ? "Please wait..." : "Login"}
</Button>
</form>
</CardContent>
</Card>
</div>
);
}