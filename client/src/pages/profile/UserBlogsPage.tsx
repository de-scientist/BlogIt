import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserBlogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () =>
      (await api.get("/profile/blogs", { withCredentials: true })).data,
  });

  if (isLoading) return <p className="p-10">Loading blogs...</p>;

  const blogs = data.blogs;

  return (
    <div className="min-h-screen bg-gray-50 p-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Your Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500 italic">No blogs yet.</p>
      ) : (
        blogs.map((blog: any, i: number) => (
          <Card
            key={i}
            className="shadow-sm hover:shadow-md transition border border-gray-200"
          >
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {blog.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{blog.synopsis}</p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(blog.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
