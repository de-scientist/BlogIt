import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Blog = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  createdAt: string;
  user: { firstName: string; lastName: string };
};

export default function ListBlogs() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Blog[], any>(["blogs"], async () => {
    const { data } = await api.get("/blogs", { withCredentials: true });
    return data.blogs;
  });

  const deleteMutation = useMutation(
    async (id: string) => api.patch(`/blogs/trash/${id}`, {}, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog moved to trash");
        queryClient.invalidateQueries(["blogs"]);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Blogs</h2>
        <Link to="/blogs/new" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Create
        </Link>
      </div>
      <div className="grid gap-4">
        {data?.map((b) => (
          <div key={b.id} className="p-4 border rounded">
            <h3 className="font-bold">{b.title}</h3>
            <p className="text-sm">{b.synopsis}</p>
            <div className="mt-2 flex gap-2">
              <Link to={`/blogs/edit/${b.id}`} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Edit
              </Link>
              <button
                onClick={() => deleteMutation.mutate(b.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Trash
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
