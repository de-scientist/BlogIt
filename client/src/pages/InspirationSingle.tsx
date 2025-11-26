import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import blogs from "@/data/blog"; // import your expanded blogs

export default function InspirationSingle() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <div className="pt-28 text-center text-slate-600 dark:text-slate-300">
        <h2 className="text-2xl font-semibold">Blog not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 pt-28 pb-16">
      <Card className="max-w-4xl mx-auto shadow-xl border border-slate-300 dark:border-slate-700 rounded-2xl">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-t-2xl"
        />

        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {blog.title}
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{blog.synopsis}</p>
        </CardHeader>

        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            {blog.description}
          </p>

          {/* Markdown rendering */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* CTA Button for Creating a Blog */}
      <div className="mt-12 text-center">
        <Link to="/blogs/create">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-xl shadow-xl hover:opacity-90 transition-all font-semibold">
            Create Your Own Blog
          </Button>
        </Link>
      </div>
    </div>
  );
}
