import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Blog } from "./types";

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
    defaultValues: {
      title: "",
      synopsis: "",
      featuredImageUrl: "",
      content: "",
    },
  });

  const mutation = useMutation(
    (newBlog: BlogForm) =>
      api.post("/blogs", newBlog, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog created successfully");
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
        navigate("/blogs");
      },
      onError: (err: any) =>
        toast.error(err.response?.data?.message || "Failed to create blog"),
    }
  );

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4"
    >
      <input
        placeholder="Title"
        {...form.register("title")}
        className="w-full border p-2 rounded"
      />
      <input
        placeholder="Synopsis"
        {...form.register("synopsis")}
        className="w-full border p-2 rounded"
      />
      <input
        placeholder="Featured Image URL"
        {...form.register("featuredImageUrl")}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Content"
        {...form.register("content")}
        className="w-full border p-2 rounded h-40"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Blog
      </button>
    </form>
  );
}
