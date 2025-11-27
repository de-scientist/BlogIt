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
      <Card className="shadow-2xl border border-gray-100 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        {/* Featured Image */}
        {blog.featuredImageUrl && (
          <img
            src={blog.featuredImageUrl}
            alt={blog.title}
            className="w-full h-[360px] object-cover"
          />
        )}

        <CardContent className="py-8 px-6 sm:px-10">
          {/* Title with Gradient */}
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            {blog.title}
          </h1>

          {/* Synopsis */}
          <p className="text-lg text-gray-700 italic mt-3 dark:text-gray-400">
            {blog.synopsis}
          </p>

          {/* Metadata */}
          <small className="block mt-4 text-gray-500">
            By **{blog.user.firstName} {blog.user.lastName}** •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </small>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {/* Markdown content */}
          {/* Added dark mode support to the prose class for better readability */}
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </article>
        </CardContent>

        <CardFooter className="flex justify-between px-6 pb-6 sm:px-10 sm:pb-8 border-t dark:border-slate-700">
          {/* Back Button - Styled as Outline (light style) */}
          <Link to="/dashboard" rel="noopener">
            <Button 
              variant="outline"
              className="px-6 py-2 text-md border-gray-400 dark:border-gray-500 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition"
            >
              ← Back to blogs
            </Button>
          </Link>

          {/* Edit Button - Primary Gradient Style */}
          <Link to={`/blogs/edit/${blog.id}`} rel="noopener">
            <Button
              className="px-6 py-2 text-md font-semibold bg-gradient-to-r from-green-500 to-teal-400 text-white shadow-lg shadow-green-500/50 hover:opacity-90 transition-all duration-200"
            >
              Edit Blog ✍️
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}