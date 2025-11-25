import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type BlogForm = {
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  content: string;
};

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`, { withCredentials: true });
      return res.data.blog;
    },
    enabled: !!id,
  });

  const form = useForm<BlogForm>({
    defaultValues: { title: "", synopsis: "", featuredImageUrl: "", content: "" },
  });

  if (blog)
    form.reset({
      title: blog.title,
      synopsis: blog.synopsis,
      featuredImageUrl: blog.featuredImageUrl,
      content: blog.content || "",
    });

  const mutation = useMutation({
    mutationFn: (updatedData: BlogForm) =>
      api.patch(`/blogs/${id}`, updatedData, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog updated");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/blogs");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Update failed"),
  });

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Edit Blog</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Title"
            {...form.register("title", { required: "Title required" })}
          />
          {form.formState.errors.title && (
            <p className="text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="synopsis">Synopsis</Label>
          <Input
            id="synopsis"
            placeholder="Synopsis"
            {...form.register("synopsis", { required: "Synopsis required" })}
          />
          {form.formState.errors.synopsis && (
            <p className="text-red-500">{form.formState.errors.synopsis.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
          <Input id="featuredImageUrl" placeholder="Image URL" {...form.register("featuredImageUrl")} />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Content"
            {...form.register("content", { required: "Content required" })}
            className="h-40"
          />
          {form.formState.errors.content && (
            <p className="text-red-500">{form.formState.errors.content.message}</p>
          )}
        </div>

        <Button type="submit" disabled={mutation.isLoading} className="w-full">
          {mutation.isLoading ? "Updating..." : "Update Blog"}
        </Button>
      </CardContent>
    </Card>
  );
}
