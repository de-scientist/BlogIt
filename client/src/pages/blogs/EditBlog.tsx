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
import { Upload, ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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
    },
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
        <p className="text-gray-500 text-lg animate-pulse">Loading blog...</p>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-10 shadow-lg border rounded-xl bg-white">
      <CardHeader>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Edit Your Story
        </h2>
        <p className="text-gray-500 mt-1">Refine your words. Shape your voice.</p>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">

        {/* TITLE */}
        <div>
          <Label htmlFor="title" className="font-medium">Title</Label>
          <Input
            id="title"
            placeholder="Enter a compelling title..."
            className="mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("title", { required: "Title is required" })}
          />
        </div>

        {/* SYNOPSIS */}
        <div>
          <Label htmlFor="synopsis" className="font-medium">Synopsis</Label>
          <Input
            id="synopsis"
            placeholder="Short teaser for your blog..."
            className="mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("synopsis", { required: "Synopsis is required" })}
          />
        </div>

        {/* FEATURED IMAGE UPLOAD */}
        <div>
          <Label className="font-medium">Featured Image</Label>
          <label
            className="flex items-center justify-center gap-2 w-full h-12 border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <Upload className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 text-sm">
              {uploading ? "Uploading..." : "Click to upload image"}
            </span>
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          {form.watch("featuredImageUrl") ? (
            <img
              src={form.watch("featuredImageUrl")}
              alt="Featured image preview"
              className="rounded-lg w-full h-52 object-cover mt-2 shadow"
            />
          ) : (
            <div className="w-full h-52 border rounded-lg flex items-center justify-center text-gray-300 mt-2">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div>
          <Label htmlFor="content" className="font-medium">Content (Markdown supported)</Label>
          <Textarea
            id="content"
            placeholder="Write your blog here..."
            className="h-48 mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("content", { required: "Content is required" })}
          />
        </div>

        {/* LIVE PREVIEW */}
        {(form.watch("featuredImageUrl") || form.watch("content")) && (
          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            {form.watch("featuredImageUrl") && (
              <img
                src={form.watch("featuredImageUrl")}
                alt="Featured image preview"
                className="w-full h-52 object-cover rounded-md mb-4"
              />
            )}
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    alt={props.alt || "Markdown image"}
                    className="max-w-full rounded-md"
                  />
                ),
              }}
            >
              {form.watch("content") || ""}
            </ReactMarkdown>
          </div>
        )}

        {/* SUBMIT */}
        <Button
          disabled={mutation.isLoading || uploading}
          className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-all"
          onClick={form.handleSubmit(values => mutation.mutate(values))}
        >
          {mutation.isLoading ? "Saving changes..." : "Update Blog ✨"}
        </Button>
      </CardContent>
    </Card>
  );
}
