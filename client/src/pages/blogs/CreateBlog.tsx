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
import { useState, useEffect } from "react"; // 💡 Import useEffect
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Spinner } from "@/components/ui/spinner";

type BlogForm = {
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  content: string;
};

// 💡 Define Local Storage Key
const LOCAL_STORAGE_KEY = "draftBlogForm";

// --- Error Mapping Dictionary (Refined) ---
const serverErrorMap = new Map<string, keyof BlogForm>([
    ["title", "title"],
    ["synopsis", "synopsis"],
    ["featured image", "featuredImageUrl"],
    ["content", "content"],
]);

// 💡 Function to get initial values from storage
const getInitialValues = (): BlogForm => {
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData) as BlogForm;
        }
    } catch (error) {
        console.error("Error parsing stored data:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear bad data
    }
    // Default empty state if nothing is stored or storage fails
    return {
        title: "",
        synopsis: "",
        featuredImageUrl: "",
        content: "",
    };
};


export default function CreateBlog() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const form = useForm<BlogForm>({
    // 💡 Use the function to load stored data as default values
    defaultValues: getInitialValues(),
  });

  // 💡 PERSISTENCE: Save form data to local storage on change
  useEffect(() => {
    // Subscribe to all form value changes
    const subscription = form.watch((value, { name, type }) => {
      // Exclude form internal events like focus/blur from triggering unnecessary saves
      if (type !== 'change' || (name && name.startsWith('_'))) return;
      
      // Save the current form values (draft)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    });

    // Unsubscribe when the component unmounts
    return () => subscription.unsubscribe();
  }, [form]);


  // 💡 IMAGE UPLOAD (No functional changes, just cleanup)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        form.setValue("featuredImageUrl", result.secure_url, { shouldValidate: true }); // set value and trigger save
        toast.success("Image uploaded!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
      toast.dismiss(toastId);
    }
  };

  const mutation = useMutation({
    mutationFn: (newBlog: BlogForm) =>
      api.post("/blogs", newBlog, { withCredentials: true }),
    onSuccess: () => {
      // 💡 SUCCESS: Clear the local storage draft
      localStorage.removeItem(LOCAL_STORAGE_KEY); 
      
      toast.success("Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/blogs");
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message;
      const statusCode = err.response?.status;

      if (statusCode === 401) {
        toast.error(errorMessage || "Session expired. Please log in.");
        navigate("/auth/login"); 
        return;
      } 
      
      if (statusCode === 400 && errorMessage) {
        const msgLower = errorMessage.toLowerCase();
        let fieldToTarget: keyof BlogForm | undefined = undefined;

        for (const [keyPhrase, fieldName] of serverErrorMap.entries()) {
            if (msgLower.includes(keyPhrase)) {
                fieldToTarget = fieldName;
                break;
            }
        }

        if (fieldToTarget) {
            form.setError(fieldToTarget, {
                type: "server",
                message: errorMessage,
            });
            toast.error(`Validation failed: ${errorMessage}`);
        } else {
            toast.error(errorMessage);
        }
      } 
      else {
        toast.error(errorMessage || "Failed to create blog");
      }
    },
  });

  return (
    // ... (The entire return block remains the same, using form.register and form.watch)
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
        {/* TITLE */}
        <div>
          <Label htmlFor="title" className="font-medium">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Give your blog a powerful title..."
            className="mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("title", { required: "Title is required" })}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* SYNOPSIS */}
        <div>
          <Label htmlFor="synopsis" className="font-medium">
            Synopsis
          </Label>
          <Input
            id="synopsis"
            placeholder="A short teaser that hooks your audience..."
            className="mt-1 focus:ring-2 focus:ring-purple-500"
            {...form.register("synopsis", { required: "Synopsis is required" })}
          />
          {form.formState.errors.synopsis && (
            <p className="text-sm text-red-500">
              {form.formState.errors.synopsis.message}
            </p>
          )}
        </div>

        {/* FEATURED IMAGE */}
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
              className="bg-purple-100 text-purple-700 cursor-default flex items-center justify-center gap-2"
            >
              {uploading ? <Spinner className="w-5 h-5" /> : "Upload"}
            </Button>
          </div>
          {/* Display stored image URL if available */}
          {form.watch("featuredImageUrl") && (
              <img
                src={form.watch("featuredImageUrl")}
                alt="Featured image preview"
                className="w-full h-52 object-cover rounded-md mt-4 shadow"
              />
          )}
          {form.formState.errors.featuredImageUrl && (
            <p className="text-sm text-red-500 mt-2">
              {form.formState.errors.featuredImageUrl.message}
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div>
          <Label htmlFor="content" className="font-medium">
            Content (Markdown supported)
          </Label>
          <Textarea
            id="content"
            placeholder="Let your words dance here..."
            {...form.register("content", { required: "Content is required" })}
            className="h-48 mt-1 focus:ring-2 focus:ring-purple-500"
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-500">
              {form.formState.errors.content.message}
            </p>
          )}
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
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {form.watch("content") || ""}
            </ReactMarkdown>
          </div>
        )}

        {/* SUBMIT */}
        <Button
          disabled={mutation.isPending || uploading}
          className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition-all rounded-xl flex justify-center items-center"
          onClick={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {mutation.isPending ? (
            <Spinner className="w-5 h-5" />
          ) : (
            "Publish Blog ✨"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}