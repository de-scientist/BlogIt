import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import Link from "react-router-dom";
import { toast } from "sonner";
import { Blog } from "@/types";

export default function BlogList() {
  const queryClient = useQueryClient();

  // Fetch blogs
  const { data: blogs, isLoading } = useQuery<Blog[]>(["blogs"], async () => {
    const { data } = await api.get("/blogs", { withCredentials: true });
    return data.blogs;
  });

  // Soft delete mutation
  const deleteMutation = useMutation(
    (id: string) => api.patch(`/blogs/trash/${id}`, {}, { withCredentials: true }),
    {
      onSuccess: () => {
        toast.success("Blog moved to trash");
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: (err: any) => toast.error(err.response?.data?.message || "Delete failed"),
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">All Blogs</h2>
        <Link to="/blogs/new" className="text-green-600 hover:underline">
          Create
        </Link>
      </div>

      <div className="grid gap-4">
        {blogs?.map((blog) => (
          <div key={blog.id} className="p-4 border rounded space-y-2">
            <h3 className="font-bold">{blog.title}</h3>
            <p className="text-sm">{blog.synopsis}</p>
            <div className="flex gap-2">
              <Link
                to={`/blogs/edit/${blog.id}`}
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => deleteMutation.mutate(blog.id)}
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
