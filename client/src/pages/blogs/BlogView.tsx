import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // 💡 Added CardHeader, CardTitle
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, ArrowLeft, Edit, Calendar, User } from "lucide-react"; // 💡 Added icons

export default function BlogView() {
	const { id } = useParams<{ id: string }>();

	const { data: blog, isLoading, isError } = useQuery({ // 💡 Added isError
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
		// 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar) to the main container
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
						{/* Added dark mode support to the prose class for better readability */}
						<article className="prose prose-lg max-w-none dark:prose-invert">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{blog.content}
							</ReactMarkdown>
						</article>
					</CardContent>

					<CardFooter className="flex justify-between px-6 pb-6 sm:px-10 sm:pb-8 border-t dark:border-slate-700">
						
						{/* Back Button - Now using a secondary gradient for distinction */}
						<Link to="/dashboard" rel="noopener">
							<Button 
								className="px-6 py-2 text-md border-gray-400 dark:border-gray-500 bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:opacity-90 transition-all duration-200 shadow-md"
							>
								<ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
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
			</div>
		</div>
	);
}