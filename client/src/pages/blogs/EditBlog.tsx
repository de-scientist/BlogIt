import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // 💡 Added CardTitle
import { useState, useEffect } from "react"; 
import { Upload, Loader2, PenTool, Eye, Wand2, Bot } from "lucide-react"; // 💡 Added icons
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Spinner } from "@/components/ui/spinner";

// --- Type Definitions (Needed for useForm) ---
type BlogForm = {
	title: string;
	synopsis: string;
	featuredImageUrl?: string;
	content: string;
};

// 💡 Mock Rich Text Editor Component (Placeholder for a real library like Tiptap/Quill)
const RichTextEditor = ({ 
    value, 
    onChange, 
    placeholder, 
    error,
}: { 
    value: string; 
    onChange: (newValue: string) => void; 
    placeholder: string; 
    error?: string;
}) => {
    // We use a styled textarea to simulate the RTF component's output.
    return (
        <div className="space-y-1">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 min-h-[300px] 
                           dark:bg-slate-900 ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-purple-500 dark:border-slate-700'}`}
            />
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
// -----------------------------------------------------

export default function EditBlog() {
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [uploading, setUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false); // 💡 State for AI generation

	// 🔹 FETCH BLOG DATA
	const { data: blog, isLoading, isError } = useQuery({
		queryKey: ["blog", id],
		queryFn: async () => {
			const res = await api.get(`/blogs/${id}`, { withCredentials: true });
			return res.data.blog as BlogForm; // Cast data to BlogForm type
		},
	});

	// 1. 💡 USE BLOG DATA FOR DEFAULT VALUES
	const form = useForm<BlogForm>({
		defaultValues: {
			title: "",
			synopsis: "",
			featuredImageUrl: "",
			content: "",
		},
	});
    const { getValues, setValue, register, watch, handleSubmit, formState: { errors } } = form;

	// 2. 💡 POPULATE FORM AFTER DATA FETCH
	useEffect(() => {
		if (blog) {
			form.reset(blog);
		}
	}, [blog, form]);
    
    // 💡 SIMULATED AI SUGGESTION FUNCTION
	const handleGenerateAISuggestion = () => {
		if (isGenerating) return;

		setIsGenerating(true);
		const currentContent = getValues("content");
        const currentTitle = getValues("title");
        
		toast.info("AI is analyzing content for suggestions...", { position: "bottom-left" }); // 💡 Toast Position

		// Simulate API call delay (Replace with actual AI API call)
		setTimeout(() => {
			setIsGenerating(false);
            
            // Placeholder Logic for AI Response
            const suggestion = `\n\n**[AI Suggestion]** Review this section about "${currentTitle}". It needs a clearer transition to the conclusion.`;

            // Append suggestion to content
            setValue("content", currentContent + suggestion, { shouldDirty: true });
            
			toast.success("AI suggestions generated and appended to content!", { position: "bottom-left" }); // 💡 Toast Position
		}, 2000); 
	};


	// 🔹 IMAGE UPLOAD
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const toastId = toast.loading("Uploading image...", { position: "bottom-left" }); // 💡 Toast Position

		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

		try {
			const res = await fetch(
				`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
				{ method: "POST", body: data },
			);
			const result = await res.json();

			if (result.secure_url) {
				setValue("featuredImageUrl", result.secure_url);
				toast.success("Image uploaded!", { position: "bottom-left" }); // 💡 Toast Position
			} else {
				toast.error("Failed to upload image. Please try again.", { position: "bottom-left" }); // 💡 Toast Position
			}
		} catch {
			toast.error("Upload error", { position: "bottom-left" }); // 💡 Toast Position
		} finally {
			setUploading(false);
			toast.dismiss(toastId);
		}
	};


	// 🔹 UPDATE BLOG MUTATION
	const mutation = useMutation({
		mutationFn: (updatedBlog: BlogForm) =>
			api.patch(`/blogs/${id}`, updatedBlog, { withCredentials: true }),
		onSuccess: () => {
			toast.success("Blog updated successfully.", { position: "bottom-left" }); // 💡 Toast Position
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			queryClient.invalidateQueries({ queryKey: ["blog", id] }); 
			navigate(`/blogs/view/${id}`);
		},
		onError: (err: any) => {
			const errorMessage = err.response?.data?.message || "Failed to update blog.";
			
			// Enhanced server-side error handling via toast
			toast.error(errorMessage, { position: "bottom-left" }); // 💡 Toast Position

			if (err.response?.status === 400 && err.response?.data?.message) {
				// Simplified error setting for demonstration
				const msg = errorMessage.toLowerCase();
				if (msg.includes("title")) form.setError("title", { type: "server", message: errorMessage });
				if (msg.includes("synopsis")) form.setError("synopsis", { type: "server", message: errorMessage });
				if (msg.includes("featured image")) form.setError("featuredImageUrl", { type: "server", message: errorMessage });
				if (msg.includes("content")) form.setError("content", { type: "server", message: errorMessage });
			}
		},
	});

	const isSubmitting = mutation.isPending;
    const content = watch("content");
    const featuredImageUrl = watch("featuredImageUrl");


	// 3. 🛑 CONDITIONAL RENDERING WHILE LOADING/ERROR
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center">
				<Loader2 className="w-8 h-8 mr-2 text-purple-600 animate-spin" />
				<p className="text-gray-500 dark:text-gray-400 text-lg">Loading blog data...</p>
			</div>
		);
	}

	if (isError || !blog) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center p-20">
				<p className="text-red-500 text-lg">Error loading blog or blog not found. Please check the ID.</p>
				<Button onClick={() => navigate('/dashboard')} className="ml-4 bg-purple-600 hover:bg-purple-700">Go to Dashboard</Button>
			</div>
		);
	}

	// 4. ✅ Render the form
	return (
		// 💡 ADJUSTED: Padding for Navbar (pt-16) and Sidebar (pl-4)
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">
			<div className="max-w-6xl mx-auto py-8">
				
				{/* ---------------------------------- */}
				{/* HEADER */}
				{/* ---------------------------------- */}
				<header className="mb-6">
					<h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text flex items-center">
						<PenTool className="w-8 h-8 mr-3 text-purple-600" /> Edit Blog Post
					</h1>
					<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
						Refine your existing content and use the AI assistant to polish your work.
					</p>
					<hr className="mt-4 border-gray-200 dark:border-gray-700" />
				</header>

				{/* ---------------------------------- */}
				{/* MAIN EDITING AREA (Split View) */}
				{/* ---------------------------------- */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					
					{/* ------------------- COLUMN 1: EDITOR ------------------- */}
					<div className="lg:col-span-1 space-y-6">
						<Card className="shadow-lg dark:bg-slate-800">
							<CardHeader>
								<CardTitle className="flex items-center text-xl text-purple-600 dark:text-purple-400">
									<PenTool className="w-5 h-5 mr-2" /> Content Editor
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6 pt-4">

								{/* TITLE */}
								<div>
									<Label htmlFor="title" className="font-medium dark:text-gray-300">Title</Label>
									<Input
										id="title"
										placeholder="Give your blog a powerful title..."
										className="mt-1 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:border-slate-700"
										{...register("title", { required: "Title is required" })}
									/>
									{errors.title && (
										<p className="text-sm text-red-500">{errors.title.message}</p>
									)}
								</div>

								{/* SYNOPSIS */}
								<div>
									<Label htmlFor="synopsis" className="font-medium dark:text-gray-300">Synopsis</Label>
									<Input
										id="synopsis"
										placeholder="A short teaser that hooks your audience..."
										className="mt-1 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:border-slate-700"
										{...register("synopsis", { required: "Synopsis is required" })}
									/>
									{errors.synopsis && (
										<p className="text-sm text-red-500">{errors.synopsis.message}</p>
									)}
								</div>

								{/* FEATURED IMAGE UPLOAD */}
								<div>
									<Label className="font-medium dark:text-gray-300">Featured Image</Label>
									<label className="flex items-center justify-center gap-2 w-full h-12 border border-dashed border-purple-400 rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition mt-2">
										<Upload className="w-5 h-5 text-purple-600" />
										<span className="text-purple-600 text-sm flex items-center gap-2">
											{uploading ? (
												<Spinner className="w-5 h-5" />
											) : (
												"Click to upload or replace image"
											)}
										</span>
										<Input
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
									</label>
									{featuredImageUrl && (
										<img
											src={featuredImageUrl}
											alt="Featured image preview"
											className="w-full h-40 object-cover rounded-md mt-4 shadow"
										/>
									)}
									{errors.featuredImageUrl && (
										<p className="text-sm text-red-500 mt-2">
											{errors.featuredImageUrl.message}
										</p>
									)}
								</div>
								
								{/* 💡 AI SUGGESTION BUTTON */}
								<div className="mt-6">
									<Button
										type="button"
										onClick={handleGenerateAISuggestion}
										disabled={isGenerating || isSubmitting}
										className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center rounded-lg shadow-md"
									>
										{isGenerating ? (
											<>
												<Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Suggestions...
											</>
										) : (
											<>
												<Wand2 className="w-5 h-5 mr-2" /> AI Writing Assistant
											</>
										)}
									</Button>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
										<Bot className="w-3 h-3 mr-1" /> The AI will append content suggestions to your editor.
									</p>
								</div>
								
								{/* CONTENT TEXTAREA (Rich Text Editor Mock) */}
								<div>
									<Label htmlFor="content" className="font-medium dark:text-gray-300">
										Content (Rich Text Editor)
									</Label>
                                    <RichTextEditor 
                                        value={content}
                                        onChange={(newValue) => setValue("content", newValue, { shouldValidate: true })}
                                        placeholder="Refine your blog content here..."
                                        error={errors.content?.message}
                                    />
								</div>
							</CardContent>
						</Card>

						{/* SUBMIT BUTTON */}
						<Button
							disabled={isSubmitting || uploading}
							className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition-all rounded-xl flex justify-center items-center shadow-lg"
							onClick={handleSubmit((values) => mutation.mutate(values))}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...
								</>
							) : (
								"Update Blog ✨"
							)}
						</Button>
					</div>


					{/* ------------------- COLUMN 2: LIVE PREVIEW ------------------- */}
					<div className="lg:col-span-1">
						<Card className="shadow-lg dark:bg-slate-800 h-full">
							<CardHeader>
								<CardTitle className="flex items-center text-xl text-purple-600 dark:text-purple-400">
									<Eye className="w-5 h-5 mr-2" /> Live Preview
								</CardTitle>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Your content as it will appear on the blog page.
								</p>
							</CardHeader>
							<CardContent className="pt-4 h-[calc(100%-120px)] overflow-y-auto blog-preview-content">
								
								{/* Display Title */}
								<h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
									{watch("title") || "Untitled Post"}
								</h2>

								{/* Display Featured Image */}
								{featuredImageUrl && (
									<img
										src={featuredImageUrl}
										alt="Blog featured image preview"
										className="w-full max-h-64 object-cover rounded-lg mb-6 shadow-md"
									/>
								)}

								{/* Display Content Preview */}
								<div className="prose dark:prose-invert max-w-none">
									<ReactMarkdown rehypePlugins={[rehypeRaw]}>
										{content || "Start typing in the editor to see your changes rendered here..."}
									</ReactMarkdown>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}