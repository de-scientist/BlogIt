import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function Trash() {
  const queryClient = useQueryClient();

  // ✅ useQuery v5 object syntax
  const { data = [], isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await api.get("/blogs/trash", { withCredentials: true });
      return res.data.blogs;
    },
  });

  // ✅ useMutation v5 object syntax
  const recoverMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Recovered!");
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/permanent/${id}`, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Deleted permanently");
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {data.length === 0 ? (
        <p>Your trash is empty.</p>
      ) : (
        data.map((blog: any) => (
          <div key={blog.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="font-bold">{blog.title}</h2>
              <small>{new Date(blog.lastUpdated || blog.createdAt).toLocaleDateString()}</small>
            </div>
            <div className="space-x-2">
              <button
                className="px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => recoverMutation.mutate(blog.id)}
              >
                Recover
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => deleteMutation.mutate(blog.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
