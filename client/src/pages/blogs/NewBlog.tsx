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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<BlogForm>();

  const mutation = useMutation(
    async (data: BlogForm) => api.post("/blogs", data, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog created successfully");
        queryClient.invalidateQueries(["blogs"]);
        navigate("/blogs");
      },
      onError: (err: any) => toast.error(err.response?.data?.message || "Creation failed"),
    }
  );

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <input {...form.register("title")} placeholder="Title" className="w-full border p-2 rounded" />
      <input {...form.register("synopsis")} placeholder="Synopsis" className="w-full border p-2 rounded" />
      <input {...form.register("featuredImageUrl")} placeholder="Featured Image URL" className="w-full border p-2 rounded" />
      <textarea {...form.register("content")} placeholder="Content" className="w-full border p-2 rounded h-40" />
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Create
      </button>
    </form>
  );
}
