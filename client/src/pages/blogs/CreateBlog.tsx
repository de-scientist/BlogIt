import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function CreateBlog() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<BlogForm>({
    defaultValues: { title: "", synopsis: "", featuredImageUrl: "", content: "" },
  });

  const mutation = useMutation({
    mutationFn: (newBlog: BlogForm) => api.post("/blogs", newBlog, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/blogs");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to create blog"),
  });

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create a New Blog</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Title"
            {...form.register("title", { required: "Title is required" })}
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
            {...form.register("synopsis", { required: "Synopsis is required" })}
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
            {...form.register("content", { required: "Content is required" })}
            className="h-40"
          />
          {form.formState.errors.content && (
            <p className="text-red-500">{form.formState.errors.content.message}</p>
          )}
        </div>

        <Button type="submit" disabled={mutation.isLoading} className="w-full">
          {mutation.isLoading ? "Creating..." : "Create Blog"}
        </Button>
      </CardContent>
    </Card>
  );
}
