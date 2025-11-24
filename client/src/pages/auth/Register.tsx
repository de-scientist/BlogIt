import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/authStore";


export default function Register() {
const [form, setForm] = useState({ firstName: "", lastName: "", userName: "", emailAddress: "", password: "" });
const router = useRouter();


const handle = async (e: React.FormEvent) => {
e.preventDefault();
try {
await api.post('/auth/register', form);
router.push('/auth/login');
} catch (err: any) {
alert(err?.response?.data?.message || 'Registration failed');
}
};


return (
<form onSubmit={handle} className="max-w-md mx-auto">
<h2 className="text-2xl">Create account</h2>
{/* inputs for all fields */}
<input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} placeholder="First name" />
<input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} placeholder="Last name" />
<input value={form.userName} onChange={e => setForm({...form, userName: e.target.value})} placeholder="Username" />
<input value={form.emailAddress} onChange={e => setForm({...form, emailAddress: e.target.value})} placeholder="Email" />
<input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" />
<button type="submit">Register</button>
</form>
);
}