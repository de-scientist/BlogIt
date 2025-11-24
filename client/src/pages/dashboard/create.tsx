import { useState } from "react";
const blogSchema = z.object({
title: z.string().min(3, "Title is too short"),
content: z.string().min(10, "Content is too short"),
});


type BlogForm = z.infer<typeof blogSchema>;


export default function CreateBlogPage() {
const [loading, setLoading] = useState(false);


const form = useForm<BlogForm>({ resolver: zodResolver(blogSchema) });


const createBlog = useMutation({
mutationFn: async (data: BlogForm) => {
setLoading(true);
return await axios.post("/api/blogs", data);
},
onSuccess: () => {
toast({ title: "Blog created" });
form.reset();
setLoading(false);
},
onError: () => {
toast({ title: "Error creating blog", variant: "destructive" });
setLoading(false);
},
});


return (
<div className="flex justify-center py-10">
<Card className="w-full max-w-2xl">
<CardHeader>
<CardTitle>Create New Blog</CardTitle>
</CardHeader>
<CardContent>
<form
onSubmit={form.handleSubmit((d) => createBlog.mutate(d))}
className="space-y-4"
>
{loading ? (
<>
<Skeleton className="h-10 w-full" />
<Skeleton className="h-32 w-full" />
</>
) : (
<>
<Input placeholder="Blog title" {...form.register("title")} />
<Textarea
placeholder="Write something..."
className="min-h-[150px]"
{...form.register("content")}
/>
<Button type="submit" disabled={loading}>
Publish
</Button>
</>
)}
</form>
</CardContent>
</Card>
</div>
);
}