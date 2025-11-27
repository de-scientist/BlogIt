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
import { useState, useEffect } from "react"; // 💡 Added useEffect
import { Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Spinner } from "@/components/ui/spinner";

// ... (BlogForm type and Error Mapping not needed here)

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  
  // 🔹 FETCH BLOG DATA
  const { data: blog, isLoading, isError } = useQuery({ // 💡 Grab isError too
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`, { withCredentials: true });
      return res.data.blog;
    },
    // ❌ Removed onSuccess here, we use the values from the query directly
  });

  // 1. 💡 USE BLOG DATA FOR DEFAULT VALUES
  const form = useForm<BlogForm>({
    // We only set defaultValues if blog data is available. 
    // This allows the useForm instance to be created before data is fetched.
    defaultValues: {
      title: "",
      synopsis: "",
      featuredImageUrl: "",
      content: "",
    },
    // We will use useEffect and reset() to populate once data is ready
  });
  
  // 2. 💡 POPULATE FORM AFTER DATA FETCH
  useEffect(() => {
      if (blog) {
          form.reset(blog);
      }
  }, [blog, form]);
  
  // ... (handleImageUpload function remains the same)

  // 🔹 IMAGE UPLOAD (Remains the same)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (logic remains the same)
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading image...");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data },
      );
      const result = await res.json();

      if (result.secure_url) {
        form.setValue("featuredImageUrl", result.secure_url);
        toast.success("Image uploaded!");
      } else {
         toast.error("Failed to upload image. Please try again.");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
      toast.dismiss(toastId);
    }
  };


  // 🔹 UPDATE BLOG MUTATION (Remains the same)
  const mutation = useMutation({
    mutationFn: (updatedBlog: BlogForm) =>
      api.patch(`/blogs/${id}`, updatedBlog, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", id] }); // Invalidate single blog query
      navigate(`/blogs/view/${id}`);
    },
    onError: (err: any) => {
      if (err.response?.status === 400 && err.response?.data?.message) {
        // ... (Error handling logic remains the same)
        const msg = err.response.data.message.toLowerCase();
        
        // Simplified error setting logic using toast for feedback
        toast.error(`Validation failed: ${err.response.data.message}`);

        if (msg.includes("title")) form.setError("title", { type: "server", message: err.response.data.message });
        if (msg.includes("synopsis")) form.setError("synopsis", { type: "server", message: err.response.data.message });
        if (msg.includes("featured image")) form.setError("featuredImageUrl", { type: "server", message: err.response.data.message });
        if (msg.includes("content")) form.setError("content", { type: "server", message: err.response.data.message });
      } else {
        toast.error(err.response?.data?.message || "Failed to update blog.");
      }
    },
  });

  // 3. 🛑 CONDITIONAL RENDERING WHILE LOADING/ERROR
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spinner className="w-8 h-8 mr-2 text-purple-600" />
        <p className="text-gray-500 text-lg animate-pulse">Loading blog data...</p>
      </div>
    );
  }

  if (isError) {
      return (
          <div className="flex justify-center items-center p-20">
              <p className="text-red-500 text-lg">Error loading blog. Please try refreshing.</p>
              <Button onClick={() => navigate('/dashboard')} className="ml-4">Go to Dashboard</Button>
          </div>
      );
  }

  // 4. ✅ Render the form ONLY after data (blog) is loaded
  return (
    <Card className="max-w-3xl mx-auto mt-10 shadow-lg border rounded-xl bg-white">
      {/* ... (CardHeader remains the same) */}
      <CardHeader>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Edit Your Story
        </h2>
        <p className="text-gray-500 mt-1">
          Refine your words. Shape your voice.
        </p>
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
          {/* ... (Error display remains the same) */}
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* SYNOPSIS */}
        {/* ... (Input fields continue using form.register, which now has data from reset) ... */}
        <div>
          <Label htmlFor="synopsis" className="font-medium">Synopsis</Label>
          <Input
            id="synopsis"
            placeholder="Short teaser for your blog..."
            className="mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("synopsis", { required: "Synopsis is required" })}
          />
          {form.formState.errors.synopsis && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.synopsis.message}
            </p>
          )}
        </div>
        
        {/* FEATURED IMAGE */}
        <div>
          <Label className="font-medium">Featured Image</Label>
          <label className="flex items-center justify-center gap-2 w-full h-12 border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <Upload className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 text-sm flex items-center gap-2">
              {uploading ? (
                <Spinner className="w-5 h-5" />
              ) : (
                "Click to upload or replace image"
              )}
            </span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {form.formState.errors.featuredImageUrl && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.featuredImageUrl.message}
            </p>
          )}
          {form.watch("featuredImageUrl") && (
            <img
              src={form.watch("featuredImageUrl")}
              alt="Featured image preview"
              className="rounded-lg w-full h-52 object-cover mt-2 shadow"
            />
          )}
        </div>

        {/* CONTENT */}
        <div>
          <Label htmlFor="content" className="font-medium">
            Content (Markdown supported)
          </Label>
          <Textarea
            id="content"
            placeholder="Write your blog here..."
            className="h-48 mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("content", { required: "Content is required" })}
          />
          {form.formState.errors.content && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>


        {/* LIVE PREVIEW (remains the same) */}
        {(form.watch("featuredImageUrl") || form.watch("content")) && (
          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            {form.watch("featuredImageUrl") && (
              <img
                src={form.watch("featuredImageUrl")}
                alt="Featured image preview"
                className="w-full h-52 object-cover rounded-md mb-4"
              />
            )}
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {form.watch("content") || ""}
            </ReactMarkdown>
          </div>
        )}

        {/* SUBMIT (remains the same) */}
        <Button
          disabled={mutation.isPending || uploading}
          className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition-all rounded-xl flex justify-center items-center"
          onClick={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {mutation.isPending ? (
            <Spinner className="w-5 h-5" />
          ) : (
            "Update Blog ✨"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}