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
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery(
    ["blog", id],
    async () => (await api.get(`/blogs/${id}`, { withCredentials: true })).data.blog,
    { enabled: !!id }
  );

  const form = useForm<BlogForm>({
    defaultValues: { title: "", synopsis: "", featuredImageUrl: "", content: "" },
  });

  if (blog) form.reset({ ...blog });

  const mutation = useMutation(
    (updatedData: BlogForm) => api.patch(`/blogs/${id}`, updatedData, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog updated");
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
        navigate("/blogs");
      },
      onError: (err: any) => toast.error(err.response?.data?.message || "Update failed"),
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4 max-w-3xl mx-auto p-4"
    >
      <input placeholder="Title" {...form.register("title", { required: "Title required" })} className="w-full border p-2 rounded" />
      <input placeholder="Synopsis" {...form.register("synopsis", { required: "Synopsis required" })} className="w-full border p-2 rounded" />
      <input placeholder="Featured Image URL" {...form.register("featuredImageUrl")} className="w-full border p-2 rounded" />
      <textarea placeholder="Content" {...form.register("content", { required: "Content required" })} className="w-full border p-2 rounded h-40" />
      <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
        Update
      </button>
    </form>
  );
}
