import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Blog } from "./types";

export default function Trash() {
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery<Blog[]>(
    ["trash"],
    async () => {
      const { data } = await api.get("/blogs/trash", { withCredentials: true });
      return data.blogs || [];
    }
  );

  const recoverMutation = useMutation(
    (id: string) => api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trash"] }),
    }
  );

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/blogs/${id}`, { withCredentials: true }),
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trash"] }),
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (!blogs || blogs.length === 0) return <div>Trash is empty</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Trash</h2>
      {blogs.map((blog) => (
        <div key={blog.id} className="p-4 border rounded space-y-2">
          <h3 className="font-bold">{blog.title}</h3>
          <p className="text-sm">{blog.synopsis}</p>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => recoverMutation.mutate(blog.id)}
            >
              Recover
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => deleteMutation.mutate(blog.id)}
            >
              Delete Permanently
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
