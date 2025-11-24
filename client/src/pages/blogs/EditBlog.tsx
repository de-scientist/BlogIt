import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

type BlogForm = {
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  content: string;
};

export default function EditBlog() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(["blog", id], async () => {
    const { data } = await api.get(`/blogs/${id}`, { withCredentials: true });
    return data.blog as BlogForm;
  });

  const form = useForm<BlogForm>({ defaultValues: data });
  const mutation = useMutation((updatedData: BlogForm) => api.patch(`/blogs/${id}`, updatedData, { withCredentials: true }), {
    onSuccess: () => {
      toast.success("Blog updated");
      queryClient.invalidateQueries(["blogs"]);
      navigate("/blogs");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Update failed"),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <input placeholder="Title" {...form.register("title")} className="w-full border p-2 rounded" />
      <input placeholder="Synopsis" {...form.register("synopsis")} className="w-full border p-2 rounded" />
      <input placeholder="Featured Image URL" {...form.register("featuredImageUrl")} className="w-full border p-2 rounded" />
      <textarea placeholder="Content" {...form.register("content")} className="w-full border p-2 rounded h-40" />
      <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
        Update
      </button>
    </form>
  );
}
