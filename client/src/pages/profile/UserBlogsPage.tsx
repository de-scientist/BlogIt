import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UserBlogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () =>
      (await api.get("/profile/blogs", { withCredentials: true })).data,
  });

  if (isLoading) return <p className="p-10">Loading blogs...</p>;

  const blogs = data.blogs;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Your Blogs</h1>

      {blogs.length === 0 ? (
        <p>No blogs yet.</p>
      ) : (
        blogs.map((blog: any, i: number) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{blog.synopsis}</p>
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
