import { useForm } from "react-hook-form";
firstName: z.string().min(1),
lastName: z.string().min(1),
emailAddress: z.string().email(),
userName: z.string().min(3),
});


type ProfileForm = z.infer<typeof profileSchema>;


export default function ProfilePage() {
const { data } = useQuery({ queryKey: ["profile"], queryFn: async () => (await axios.get("/api/auth/me")).data });


const form = useForm<ProfileForm>({ resolver: zodResolver(profileSchema), values: data });


const updateProfile = useMutation({
mutationFn: async (payload: ProfileForm) => await axios.patch("/api/auth/update", payload),
onSuccess: () => toast({ title: "Profile updated" }),
onError: () => toast({ title: "Update failed", variant: "destructive" }),
});


return (
<div className="flex justify-center py-10">
<Card className="w-full max-w-xl">
<CardHeader>
<CardTitle>Your Profile</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<form onSubmit={form.handleSubmit((d) => updateProfile.mutate(d))} className="space-y-4">
<div>
<Label>First Name</Label>
<Input {...form.register("firstName")} />
</div>
<div>
<Label>Last Name</Label>
<Input {...form.register("lastName")} />
</div>
<div>
<Label>Email</Label>
<Input {...form.register("emailAddress")} />
</div>
<div>
<Label>Username</Label>
<Input {...form.register("userName")} />
</div>
<Button type="submit">Save Changes</Button>
</form>
</CardContent>
</Card>
</div>
);
}