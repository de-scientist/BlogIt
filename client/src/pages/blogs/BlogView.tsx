import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogView() {
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`, { withCredentials: true });
      return res.data.blog;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!blog) return <div className="p-4">Blog not found</div>;

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <h1 className="text-2xl font-bold">{blog.title}</h1>
        <p className="text-gray-500">{blog.synopsis}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {blog.featuredImageUrl && (
          <img src={blog.featuredImageUrl} alt={blog.title} className="rounded-md w-full h-64 object-cover" />
        )}
        <div>{blog.content}</div>
        <small className="text-gray-400">
          By {blog.user.firstName} {blog.user.lastName} | {new Date(blog.createdAt).toLocaleDateString()}
        </small>
      </CardContent>
      <CardFooter>
        <Link to="/blogs">
          <Button variant="outline">Back to blogs</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
