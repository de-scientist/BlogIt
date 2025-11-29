import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // 💡 ADDED: Input for comment form
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, ArrowLeft, Edit, Calendar, User, ThumbsUp, ThumbsDown, Send } from "lucide-react"; // 💡 ADDED: ThumbsUp, ThumbsDown, Send icon
import { Label } from "@/components/ui/label"; // 💡 ADDED: Label for comment form
import { Textarea } from "@/components/ui/textarea"; // 💡 ADDED: Textarea for comment form
import { useState } from "react"; // 💡 ADDED: useState hook

// 💡 Define a Comment type for type safety and clarity
interface Comment {
    id: number;
    user: string;
    timestamp: string;
    content: string;
    upvotes: number;
    downvotes: number;
    userVote: 'up' | 'down' | null;
}

// 💡 Sample initial comments data (pseudo-backend)
const initialComments: Comment[] = [
    {
        id: 1,
        user: "Jane Doe",
        timestamp: "2 hours ago",
        content: "This is a fantastic article! The section on React best practices was particularly insightful. Great job!",
        upvotes: 15,
        downvotes: 2,
        userVote: null,
    },
    {
        id: 2,
        user: "CodeMaster77",
        timestamp: "5 minutes ago",
        content: "I disagree with the conclusion on using reducers for simple state management. It adds unnecessary boilerplate. Still, a well-written post overall.",
        upvotes: 5,
        downvotes: 8,
        userVote: null,
    },
];

// --- 💡 NEW COMPONENT: Comment Section ---
const CommentSection = () => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [name, setName] = useState("");

    // Pseudo-backend: Simulate adding a comment
    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !name.trim()) return;

        const comment: Comment = {
            id: Date.now(),
            user: name.trim(),
            timestamp: "Just now",
            content: newComment.trim(),
            upvotes: 0,
            downvotes: 0,
            userVote: null,
        };

        setComments([comment, ...comments]); // Add new comment to the top
        setNewComment("");
        setName("");
    };

    // Pseudo-backend: Simulate voting
    const handleVote = (id: number, type: 'up' | 'down') => {
        setComments(prevComments => 
            prevComments.map(comment => {
                if (comment.id === id) {
                    let newUpvotes = comment.upvotes;
                    let newDownvotes = comment.downvotes;
                    let newUserVote = comment.userVote;

                    if (type === 'up') {
                        if (comment.userVote === 'up') {
                            newUpvotes--; // Undo upvote
                            newUserVote = null;
                        } else {
                            newUpvotes++; // New upvote
                            if (comment.userVote === 'down') newDownvotes--; // Remove downvote if present
                            newUserVote = 'up';
                        }
                    } else if (type === 'down') {
                        if (comment.userVote === 'down') {
                            newDownvotes--; // Undo downvote
                            newUserVote = null;
                        } else {
                            newDownvotes++; // New downvote
                            if (comment.userVote === 'up') newUpvotes--; // Remove upvote if present
                            newUserVote = 'down';
                        }
                    }

                    return { ...comment, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
                }
                return comment;
            })
        );
    };

    return (
        <div className="mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-2 border-purple-500/50">
                Comments ({comments.length})
            </h2>

            {/* Comment Submission Form */}
            <Card className="mb-8 p-6 dark:bg-slate-800 shadow-lg">
                <CardTitle className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
                    Leave a Comment
                </CardTitle>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Your Name</Label>
                        <Input 
                            id="name" 
                            type="text" 
                            placeholder="Anonymous" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100"
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="comment" className="text-gray-700 dark:text-gray-300">Your Comment</Label>
                        <Textarea 
                            id="comment" 
                            placeholder="Share your thoughts..." 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)}
                            className="dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100 min-h-[100px]"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={!newComment.trim() || !name.trim()}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all duration-200"
                    >
                        <Send className="w-4 h-4 mr-2" /> Post Comment
                    </Button>
                </form>
            </Card>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <Card key={comment.id} className="p-5 dark:bg-slate-800 border dark:border-slate-700">
                        <div className="flex justify-between items-start">
                            {/* Comment Metadata and Content */}
                            <div>
                                <p className="font-bold text-lg text-purple-600 dark:text-purple-400">{comment.user}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{comment.timestamp}</p>
                                <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                            </div>

                            {/* Upvote/Downvote Controls (Pseudo-Interactive) */}
                            <div className="flex flex-col items-center space-y-2 ml-4 flex-shrink-0">
                                {/* Upvote Button */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleVote(comment.id, 'up')}
                                    className={`
                                        transition-colors duration-150 
                                        ${comment.userVote === 'up' 
                                            ? 'text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-500' 
                                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                                        }
                                    `}
                                >
                                    <ThumbsUp className="w-5 h-5" />
                                </Button>
                                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                    {comment.upvotes - comment.downvotes}
                                </span>
                                {/* Downvote Button */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleVote(comment.id, 'down')}
                                    className={`
                                        transition-colors duration-150 
                                        ${comment.userVote === 'down' 
                                            ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500' 
                                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                                        }
                                    `}
                                >
                                    <ThumbsDown className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
// --- 💡 END: Comment Section Component ---


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


export default function BlogView() {
    const { id } = useParams<{ id: string }>();

    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ["blog", id],
        queryFn: async () => {
            const res = await api.get(`/blogs/${id}`, { withCredentials: true });
            return res.data.blog;
        },
        enabled: !!id,
    });

    // --- 1. Loading State ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center">
                <Loader2 className="w-8 h-8 mr-2 text-purple-600 animate-spin" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Loading blog content...
                </p>
            </div>
        );
    }

    // --- 2. Error/Not Found State ---
    if (isError || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex flex-col items-center justify-center p-8">
                <Card className="p-8 text-center shadow-xl dark:bg-slate-800">
                    <CardTitle className="text-3xl font-bold text-red-500">
                        Content Not Found 😞
                    </CardTitle>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        The blog post you are looking for could not be loaded or does not exist.
                    </p>
                    <Link to="/dashboard" rel="noopener" className="mt-6 inline-block">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Go to Dashboard
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    // --- 3. Render Blog View ---
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">
            <div className="max-w-4xl mx-auto py-8"> 

                <Card className="shadow-2xl border border-gray-100 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                    
                    {/* Featured Image - Moved outside CardContent for edge-to-edge look */}
                    {blog.featuredImageUrl && (
                        <img
                            src={blog.featuredImageUrl}
                            alt={blog.title}
                            className="w-full h-[400px] object-cover" // Increased height slightly
                        />
                    )}

                    <CardHeader className="py-6 px-6 sm:px-10 border-b border-gray-100 dark:border-slate-700">
                        {/* Title with Gradient */}
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                            {blog.title}
                        </h1>

                        {/* Synopsis */}
                        <p className="text-xl text-gray-700 italic dark:text-gray-400">
                            {blog.synopsis}
                        </p>
                        
                        {/* Metadata Block (Improved) */}
                        <div className="flex items-center space-x-4 mt-4 text-gray-500 text-sm">
                            <span className="flex items-center">
                                <User className="w-4 h-4 mr-1 text-purple-500" />
                                By **{blog.user.firstName} {blog.user.lastName}**
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="py-8 px-6 sm:px-10">
                        {/* Markdown content */}
                        <div className="max-w-none">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={MarkdownComponents} // 💡 APPLYING CUSTOM STYLED COMPONENTS HERE
                            >
                                {blog.content}
                            </ReactMarkdown>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between px-6 pb-6 sm:px-10 sm:pb-8 border-t dark:border-slate-700">
                        
                        {/* Back Button - Now using a secondary gradient for distinction */}
                        <Link to="/dashboard" rel="noopener">
                            <Button 
                                className="px-6 py-2 text-md border-gray-400 dark:border-gray-500 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white hover:opacity-90 transition-all duration-200 shadow-md"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                            </Button>
                        </Link>

                        {/* Edit Button - Primary Gradient Style (Retaining the original) */}
                        <Link to={`/blogs/edit/${blog.id}`} rel="noopener">
                            <Button
                                className="px-6 py-2 text-md font-semibold bg-gradient-to-r from-green-500 to-teal-400 text-white shadow-lg shadow-green-500/50 hover:opacity-90 transition-all duration-200"
                            >
                                Edit Blog <Edit className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* 💡 NEW: Comment Section Integration */}
                <CommentSection />
                
            </div>
        </div>
    );
}