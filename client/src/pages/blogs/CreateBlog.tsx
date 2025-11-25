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
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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
      } else {
        toast.error("Failed to upload image");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

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

  // Watch content for live preview
  const contentValue = form.watch("content");
  const imageValue = form.watch("featuredImageUrl");

  return (
    <Card className="max-w-3xl mx-auto mt-10 shadow-lg border rounded-xl">
      <CardHeader className="pb-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Write Something Beautiful
        </h2>
        <p className="text-gray-500 mt-1">
          Tell your story. Someone out there needs your voice.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">

        {/* Title */}
        <div>
          <Label htmlFor="title" className="font-medium">Title</Label>
          <Input
            id="title"
            placeholder="Give your blog a powerful title..."
            className="mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("title", { required: "Title is required" })}
          />
          {form.formState.errors.title && (
            <p className="text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Synopsis */}
        <div>
          <Label htmlFor="synopsis" className="font-medium">Synopsis</Label>
          <Input
            id="synopsis"
            placeholder="A short teaser that hooks your audience..."
            className="mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("synopsis", { required: "Synopsis is required" })}
          />
          {form.formState.errors.synopsis && (
            <p className="text-red-500">{form.formState.errors.synopsis.message}</p>
          )}
        </div>

        {/* Featured Image */}
        <div>
          <Label className="font-medium">Featured Image</Label>

          <div className="mt-2 flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer border-dashed border-2 border-purple-400 hover:border-purple-500"
            />

            <Button
              disabled
              variant="secondary"
              className="bg-purple-100 text-purple-700 cursor-default"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>

          {imageValue && (
            <img
              src={imageValue}
              alt="Preview"
              className="w-full h-56 object-cover rounded-md mt-4 shadow"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content" className="font-medium">Content (Markdown supported)</Label>
          <Textarea
            id="content"
            placeholder="Let your words dance here..."
            {...form.register("content", { required: "Content is required" })}
            className="h-48 mt-1 focus:ring-2 focus:ring-purple-500"
          />
          {form.formState.errors.content && (
            <p className="text-red-500">{form.formState.errors.content.message}</p>
          )}
        </div>

        {/* Live Preview */}
        {(contentValue || imageValue) && (
          <div className="border rounded-lg p-4 mt-4 bg-gray-50">
            {imageValue && (
              <img
                src={imageValue}
                alt="Preview"
                className="w-full h-52 object-cover rounded-md mb-4"
              />
            )}
            <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose max-w-full">
              {contentValue || ""}
            </ReactMarkdown>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={mutation.isLoading || uploading}
          className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition-all rounded-xl"
          onClick={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {mutation.isLoading ? "Publishing..." : "Publish Blog ✨"}
        </Button>
      </CardContent>
    </Card>
  );
}
