import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Trash() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["trash"], async () => {
    const { data } = await api.get("/blogs/trash", { withCredentials: true });
    return data.blogs;
  });

  const recoverMutation = useMutation((id: string) => api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }), {
    onSuccess: () => {
      toast.success("Blog recovered");
      queryClient.invalidateQueries(["blogs"]);
      queryClient.invalidateQueries(["trash"]);
    },
  });

  const deleteMutation = useMutation((id: string) => api.delete(`/blogs/${id}`, { withCredentials: true }), {
    onSuccess: () => {
      toast.success("Blog deleted permanently");
      queryClient.invalidateQueries(["trash"]);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Trash</h2>
      {data.length === 0 && <p>No deleted blogs</p>}
      <div className="grid gap-4">
        {data.map((b: any) => (
          <div key={b.id} className="p-4 border rounded">
            <h3 className="font-bold">{b.title}</h3>
            <div className="mt-2 flex gap-2">
              <button onClick={() => recoverMutation.mutate(b.id)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Recover
              </button>
              <button onClick={() => deleteMutation.mutate(b.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete Permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
