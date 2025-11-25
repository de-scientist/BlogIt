import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`, { withCredentials: true });
      return res.data.blog;
    }
  });

  const form = useForm<BlogForm>({
    values: blog || {
      title: "",
      synopsis: "",
      featuredImageUrl: "",
      content: "",
    },
  });

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
        { method: "POST", body: data }
      );

      const result = await res.json();

      if (result.secure_url) {
        form.setValue("featuredImageUrl", result.secure_url);
        toast.success("Image uploaded!");
      }
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (updatedBlog: BlogForm) =>
      api.put(`/blogs/${id}`, updatedBlog, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate(`/blogs/view/${id}`);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to update blog."),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <p className="text-gray-500 text-lg">Loading blog...</p>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Edit Blog</h2>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input
            placeholder="Blog title"
            {...form.register("title", { required: "Title is required" })}
          />
        </div>

        {/* Synopsis */}
        <div>
          <Label>Synopsis</Label>
          <Input
            placeholder="Short summary"
            {...form.register("synopsis", { required: "Synopsis is required" })}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label>Featured Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />

          {uploading && <p className="text-yellow-600 mt-1">Uploading...</p>}

          {form.watch("featuredImageUrl") && (
            <img
              src={form.watch("featuredImageUrl")}
              className="w-full h-48 rounded-md object-cover border mt-2"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <Label>Content (Markdown supported)</Label>
          <Textarea
            className="h-40"
            placeholder="Write your blog with Markdown..."
            {...form.register("content", { required: "Content is required" })}
          />
        </div>

        <Button
          disabled={mutation.isLoading || uploading}
          className="w-full"
          onClick={form.handleSubmit(values => mutation.mutate(values))}
        >
          {mutation.isLoading ? "Saving changes..." : "Update Blog"}
        </Button>
      </CardContent>
    </Card>
  );
}
