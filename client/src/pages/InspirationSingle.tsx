import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import blogs from "@/data/blog";
import { ArrowLeft, Edit } from "lucide-react";

// 💡 Define custom components for ReactMarkdown to apply styling
const MarkdownComponents = {
    // Headings
    h1: ({ node, ...props }: any) => <h1 className="text-4xl font-extrabold mt-8 mb-4 border-b pb-2 border-purple-300 dark:border-purple-600 text-gray-900 dark:text-gray-100" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-3xl font-bold mt-6 mb-3 pt-3 text-purple-600 dark:text-purple-400" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800 dark:text-gray-200" {...props} />,
    h4: ({ node, ...props }: any) => <h4 className="text-xl font-medium mt-4 mb-1 text-gray-700 dark:text-gray-300" {...props} />,
    
    // Paragraphs and Text
    p: ({ node, ...props }: any) => <p className="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300" {...props} />,
    a: ({ node, ...props }: any) => <a className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-extrabold text-gray-900 dark:text-gray-100" {...props} />,

    // Lists
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside space-y-2 pl-5 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside space-y-2 pl-5 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
    li: ({ node, ...props }: any) => <li className="pl-2" {...props} />,

    // Blockquotes
    blockquote: ({ node, ...props }: any) => (
        <blockquote 
            className="border-l-4 border-pink-500 pl-4 py-2 my-6 italic text-xl bg-gray-100 dark:bg-slate-700/50 text-gray-800 dark:text-gray-200 rounded-r-lg" 
            {...props} 
        />
    ),

    // Code Blocks and Inline Code
    code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        // Inline code
        if (inline) {
            return (
                <code 
                    className="bg-gray-200 dark:bg-slate-700 text-red-600 dark:text-red-400 font-mono text-sm px-1 py-0.5 rounded"
                    {...props}
                >
                    {children}
                </code>
            );
        }
        // Code block (preformatted)
        return (
            <pre 
                className="bg-gray-800 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto my-4 text-white font-mono text-sm" 
                {...props}
            >
                {/* We render the children directly as ReactMarkdown handles syntax highlighting */}
                <code className={`text-sm ${className}`} {...props}>
                    {children}
                </code>
            </pre>
        );
    },

    // Horizontal Rule
    hr: ({ node, ...props }: any) => <hr className="my-8 border-gray-300 dark:border-slate-600" {...props} />,
    
    // Image
    img: ({ node, ...props }: any) => (
        <div className="my-6 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-lg">
            <img className="w-full object-cover" {...props} />
        </div>
    ),
};


export default function InspirationSingle() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
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
    // Base layout with padding for navbar/sidebar
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
                    {/* The 'prose' classes are removed, and custom components are applied */}
                    <article className="max-w-none">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={MarkdownComponents} // 💡 Implementation of custom styling
                        >
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