import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import BlogCard from "@/components/BlogCard";
import { toast } from "sonner";

export default function Trash() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["trash"], async () => {
    const { data } = await api.get("/blogs/trash", { withCredentials: true });
    return data.blogs;
  });

  const recoverMutation = useMutation(
    (id: string) => api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog recovered");
        queryClient.invalidateQueries(["blogs"]);
        queryClient.invalidateQueries(["trash"]);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/blogs/${id}`, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog deleted permanently");
        queryClient.invalidateQueries(["trash"]);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Trash</h2>
      {data.length === 0 && <p>No deleted blogs</p>}
      <div className="grid gap-4">
        {data.map((b: any) => (
          <BlogCard
            key={b.id}
            id={b.id}
            title={b.title}
            synopsis={b.synopsis}
            actions={
              <>
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
                  Delete Permanently
                </button>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
