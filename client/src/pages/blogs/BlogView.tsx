import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!blog) return <div className="p-6">Blog not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card className="shadow-lg border rounded-xl overflow-hidden">
        {blog.featuredImageUrl && (
          <img
            src={blog.featuredImageUrl}
            alt={blog.title}
            className="w-full h-[360px] object-cover"
          />
        )}

        <CardContent className="py-6">
          <h1 className="text-4xl font-bold">{blog.title}</h1>

          <p className="text-gray-600 italic mt-2">{blog.synopsis}</p>

          <small className="block mt-3 text-gray-500">
            By {blog.user.firstName} {blog.user.lastName} •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </small>

          <hr className="my-6 border-gray-300" />

          {/* Markdown content */}
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </article>
        </CardContent>

        <CardFooter className="flex justify-between px-6 pb-6">
          <Link to="/blogs" rel="noopener">
            <Button variant="outline">Back to blogs</Button>
          </Link>

          <Link to={`/blogs/edit/${blog.id}`} rel="noopener">
            <Button>Edit Blog</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
