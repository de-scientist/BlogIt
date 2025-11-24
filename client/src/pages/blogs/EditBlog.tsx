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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<BlogForm>(
    ["blog", id],
    async () => {
      const { data } = await api.get(`/blogs/${id}`, { withCredentials: true });
      return data.blog;
    },
    { enabled: !!id }
  );

  const form = useForm<BlogForm>({
    defaultValues: { title: "", synopsis: "", featuredImageUrl: "", content: "" },
  });

  React.useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const mutation = useMutation(
    async (updatedData: BlogForm) => api.patch(`/blogs/${id}`, updatedData, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog updated");
        queryClient.invalidateQueries(["blogs"]);
        navigate("/blogs");
      },
      onError: (err: any) => toast.error(err.response?.data?.message || "Update failed"),
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <input {...form.register("title")} placeholder="Title" className="w-full border p-2 rounded" />
      <input {...form.register("synopsis")} placeholder="Synopsis" className="w-full border p-2 rounded" />
      <input {...form.register("featuredImageUrl")} placeholder="Featured Image URL" className="w-full border p-2 rounded" />
      <textarea {...form.register("content")} placeholder="Content" className="w-full border p-2 rounded h-40" />
      <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
        Update
      </button>
    </form>
  );
}
