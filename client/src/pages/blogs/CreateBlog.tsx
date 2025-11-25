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
import { useState } from "react";

type BlogForm = {
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  content: string;
};

export default function CreateBlog() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const form = useForm<BlogForm>({
    defaultValues: { title: "", synopsis: "", featuredImageUrl: "", content: "" },
  });

  // ----------------------------
  // CLOUDINARY IMAGE UPLOAD
  // ----------------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (result.secure_url) {
        form.setValue("featuredImageUrl", result.secure_url);
        toast.success("Image uploaded!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------
  // BLOG CREATION MUTATION
  // ----------------------------
  const mutation = useMutation({
    mutationFn: (newBlog: BlogForm) =>
      api.post("/blogs", newBlog, { withCredentials: true }),
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
        
        {/* TITLE */}
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

        {/* SYNOPSIS */}
        <div>
          <Label htmlFor="synopsis">Synopsis</Label>
          <Input
            id="synopsis"
            placeholder="Short summary..."
            {...form.register("synopsis", { required: "Synopsis is required" })}
          />
          {form.formState.errors.synopsis && (
            <p className="text-red-500">{form.formState.errors.synopsis.message}</p>
          )}
        </div>

        {/* FEATURED IMAGE UPLOAD */}
        <div>
          <Label>Featured Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />

          {uploading && <p className="text-yellow-600 mt-2">Uploading...</p>}

          {/* Preview */}
          {form.watch("featuredImageUrl") && (
            <img
              src={form.watch("featuredImageUrl")}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md mt-2 border"
            />
          )}
        </div>

        {/* CONTENT (Markdown Allowed) */}
        <div>
          <Label htmlFor="content">Content (Markdown supported)</Label>
          <Textarea
            id="content"
            placeholder="Write your blog here... Markdown supported."
            {...form.register("content", { required: "Content is required" })}
            className="h-40"
          />
          {form.formState.errors.content && (
            <p className="text-red-500">{form.formState.errors.content.message}</p>
          )}
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={mutation.isLoading || uploading}
          className="w-full"
          onClick={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {mutation.isLoading ? "Creating..." : "Create Blog"}
        </Button>
      </CardContent>
    </Card>
  );
}
