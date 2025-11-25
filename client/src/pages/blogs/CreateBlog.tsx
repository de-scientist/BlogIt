import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

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
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4 max-w-3xl mx-auto p-4"
    >
      <input
        placeholder="Title"
        {...form.register("title", { required: "Title is required" })}
        className="w-full border p-2 rounded"
      />
      {form.formState.errors.title && <p className="text-red-500">{form.formState.errors.title.message}</p>}

      <input
        placeholder="Synopsis"
        {...form.register("synopsis", { required: "Synopsis is required" })}
        className="w-full border p-2 rounded"
      />
      {form.formState.errors.synopsis && <p className="text-red-500">{form.formState.errors.synopsis.message}</p>}

      <input
        placeholder="Featured Image URL"
        {...form.register("featuredImageUrl")}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Content"
        {...form.register("content", { required: "Content is required" })}
        className="w-full border p-2 rounded h-40"
      />
      {form.formState.errors.content && <p className="text-red-500">{form.formState.errors.content.message}</p>}

      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Creating..." : "Create Blog"}
      </button>
    </form>
  );
}
