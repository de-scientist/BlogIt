import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

type Blog = {
  id: string;
  title: string;
};

export default function TrashBlogs() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Blog[]>(["trash"], async () => {
    const { data } = await api.get("/blogs/trash", { withCredentials: true });
    return data.blogs;
  });

  const recoverMutation = useMutation(
    async (id: string) => api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog recovered");
        queryClient.invalidateQueries(["blogs"]);
        queryClient.invalidateQueries(["trash"]);
      },
    }
  );

  const deleteMutation = useMutation(
    async (id: string) => api.delete(`/blogs/${id}`, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog permanently deleted");
        queryClient.invalidateQueries(["trash"]);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>Trash is empty</div>;

  return (
    <div className="grid gap-4">
      {data.map((b) => (
        <div key={b.id} className="p-4 border rounded flex justify-between items-center">
          <span>{b.title}</span>
          <div className="flex gap-2">
            <button
              onClick={() => recoverMutation.mutate(b.id)}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Recover
            </button>
            <button
              onClick={() => deleteMutation.mutate(b.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
