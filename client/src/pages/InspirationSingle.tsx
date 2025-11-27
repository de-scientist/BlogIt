import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; // 💡 Added CardFooter
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import blogs from "@/data/blog"; // your expanded blogs
import { ArrowLeft, Edit } from "lucide-react"; // 💡 Added icons

export default function InspirationSingle() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
        // 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar)
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-start py-20">
        <Card className="p-8 text-center shadow-xl dark:bg-slate-800">
            <h2 className="text-3xl font-bold text-red-500">Inspiration Not Found 😞</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                The inspiring story you are looking for does not exist.
            </p>
            <Link to="/inspiration" className="mt-6 inline-block">
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inspiration Hub
                </Button>
            </Link>
        </Card>
      </div>
    );
  }

  return (
    // 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 pb-10">
        <div className="max-w-4xl mx-auto py-8">
            <Card className="shadow-2xl border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden dark:bg-slate-800">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-80 object-cover rounded-t-2xl"
                />

                <CardHeader className="py-6 px-6 sm:px-10">
                    <CardTitle className="text-4xl sm:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                        {blog.title}
                    </CardTitle>
                    <p className="text-xl italic text-gray-700 dark:text-slate-300 mt-2">{blog.synopsis}</p>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 border-l-4 border-purple-500 pl-4">
                        **Key Insight:** {blog.description}
                    </p>
                </CardHeader>

                <CardContent className="py-4 px-6 sm:px-10">
                    {/* Markdown content rendered with Tailwind Typography */}
                    <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {blog.content}
                        </ReactMarkdown>
                    </article>
                </CardContent>
                
                <CardFooter className="flex justify-between px-6 pb-6 sm:px-10 sm:pb-8 border-t dark:border-slate-700">
                    <Link to="/inspiration" rel="noopener">
                        <Button 
                            variant="outline"
                            className="px-6 py-2 text-md bg-gradient-to-r from-green-500 to-teal-400 text-white border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            {/* CTA Button */}
            <div className="mt-12 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Ready to turn inspiration into action?
                </p>
                <Link to="/auth/login">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-xl shadow-xl shadow-purple-500/40 hover:opacity-90 transition-all font-semibold text-lg">
                        <Edit className="w-5 h-5 mr-2" /> Start Writing Your Story
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  );
}