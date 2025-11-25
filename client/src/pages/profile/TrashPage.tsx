import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export default function TrashPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () =>
      (await api.get("/profile/trash", { withCredentials: true })).data,
  });

  if (isLoading) return <p className="p-10">Loading...</p>;

  const blogs = data.blogs;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Trash</h1>

      {blogs.length === 0 ? (
        <p>No deleted blogs.</p>
      ) : (
        blogs.map((blog: any, i: number) => (
          <div key={i} className="p-4 border rounded-lg">
            <h2 className="font-bold">{blog.title}</h2>
            <p>{blog.synopsis}</p>
          </div>
        ))
      )}
    </div>
  );
}
