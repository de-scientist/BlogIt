import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export default function BlogView() {
  const { id } = useParams<{ id: string }>();

  // ✅ useQuery v5 syntax: object form with queryKey and queryFn
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`, { withCredentials: true });
      return res.data.blog;
    },
    enabled: !!id, // only run if id exists
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!blog) return <div className="p-4">Blog not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{blog.title}</h1>
      <p>{blog.synopsis}</p>
      {blog.featuredImageUrl && (
        <img
          src={blog.featuredImageUrl}
          alt={blog.title}
          className="rounded"
        />
      )}
      <div>{blog.content}</div>
      <small>
        By {blog.user.firstName} {blog.user.lastName} |{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </small>
      <div>
        <Link to="/blogs" className="text-blue-500">
          Back to blogs
        </Link>
      </div>
    </div>
  );
}
