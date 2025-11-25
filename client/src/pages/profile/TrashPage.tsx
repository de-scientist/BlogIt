import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export default function TrashPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () =>
      (await api.get("/profile/trash", { withCredentials: true })).data,
  });

  if (isLoading) return <p className="p-10 text-gray-500">Loading...</p>;

  const blogs = data.blogs;

  return (
    <div className="min-h-screen bg-gray-50 p-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Trash</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500 italic">No deleted blogs.</p>
      ) : (
        blogs.map((blog: any, i: number) => (
          <div
            key={i}
            className="p-5 bg-white rounded-lg shadow border border-gray-200"
          >
            <h2 className="font-bold text-lg text-gray-800">{blog.title}</h2>
            <p className="text-gray-600">{blog.synopsis}</p>
          </div>
        ))
      )}
    </div>
  );
}
