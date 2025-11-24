import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/useStore";


export default function Login() {
const [identifier, setIdentifier] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();
const setUser = useAuthStore((s) => s.setUser);


const submit = async (e: React.FormEvent) => {
e.preventDefault();
try {
const res = await api.post('/auth/login', { identifier, password });
setUser(res.data);
router.push('/blogs/list');
} catch (err: any) {
alert(err?.response?.data?.message || 'Login failed');
}
};


return (
<form onSubmit={submit} className="max-w-md mx-auto">
<h2 className="text-2xl">Login</h2>
<input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Email or username" />
<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
<button type="submit">Login</button>
</form>
);
}