import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react"; 
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Loader2, Save, PenTool, Eye, Bot, Wand2 } from "lucide-react"; 
// Assuming the following components are installed via shadcn/ui
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; 

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
    // In a production app, this would be the wrapper for the actual RTF library.
    // We use a textarea here to simulate its basic function.
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

// --- Type Definitions ---
type BlogForm = {
	title: string;
	synopsis: string;
	featuredImageUrl?: string;
	content: string;
};

// 💡 Define Local Storage Key
const LOCAL_STORAGE_KEY = "draftBlogForm";

// --- Error Mapping Dictionary (Refined) ---
const serverErrorMap = new Map<string, keyof BlogForm>([
	["title", "title"],
	["synopsis", "synopsis"],
	["featured image", "featuredImageUrl"],
	["content", "content"],
]);

// 💡 Function to get initial values from storage
const getInitialValues = (): BlogForm => {
	try {
		const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedData) {
			return JSON.parse(storedData) as BlogForm;
		}
	} catch (error) {
		console.error("Error parsing stored data:", error);
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	}
	return {
		title: "",
		synopsis: "",
		featuredImageUrl: "",
		content: "",
	};
};


export default function CreateBlog() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [uploading, setUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false); // State for AI generation

	const form = useForm<BlogForm>({
		defaultValues: getInitialValues(),
	});
    const { getValues, setValue, register, watch, handleSubmit, formState: { errors } } = form;

	// 💡 PERSISTENCE: Save form data to local storage on change
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const subscription = watch(() => {
			clearTimeout(timeoutId);
			setIsSaving(true);

			timeoutId = setTimeout(() => {
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(getValues()));
				setIsSaving(false);
			}, 1000); 

			return () => clearTimeout(timeoutId);
		});

		return () => subscription.unsubscribe();
	}, [watch, getValues]);


	// 💡 SIMULATED AI SUGGESTION FUNCTION
	const handleGenerateAISuggestion = () => {
		if (isGenerating) return;

		setIsGenerating(true);
		const currentContent = getValues("content");
        const currentTitle = getValues("title");
        
		// Ensure toast is bottom-left
		toast.info("AI is analyzing content for suggestions...", { position: "bottom-left" });

		// Simulate API call delay (Replace with actual AI API call)
		setTimeout(() => {
			setIsGenerating(false);
            
            // Placeholder Logic for AI Response
            const suggestion = `\n\n**[AI Suggestion]** You could elaborate on the following point: "${currentTitle || 'the main topic'}". Consider adding a section about practical examples or a concluding thought on future trends in this area.`;

            // Append suggestion to content
            setValue("content", currentContent + suggestion, { shouldDirty: true });
            
			// Ensure toast is bottom-left
			toast.success("AI suggestions generated and appended to content!", { position: "bottom-left" });
		}, 2000); 
	};


	// 💡 IMAGE UPLOAD
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		// Ensure toast is bottom-left
		const toastId = toast.loading("Uploading image...", { position: "bottom-left" }); 

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
				setValue("featuredImageUrl", result.secure_url, { shouldValidate: true }); 
				// Ensure toast is bottom-left
				toast.success("Image uploaded!", { position: "bottom-left" }); 
			} else {
				// Ensure toast is bottom-left
				toast.error("Failed to upload image", { position: "bottom-left" }); 
			}
		} catch {
			// Ensure toast is bottom-left
			toast.error("Upload error", { position: "bottom-left" }); 
		} finally {
			setUploading(false);
			toast.dismiss(toastId);
		}
	};

	const mutation = useMutation({
		mutationFn: (newBlog: BlogForm) =>
			api.post("/blogs", newBlog, { withCredentials: true }),
		onSuccess: () => {
			localStorage.removeItem(LOCAL_STORAGE_KEY); 
			
			
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			navigate("/dashboard");
			// Ensure toast is bottom-left
			toast.success("Blog created successfully", { position: "bottom-left" }); 
		},
		onError: (err: any) => {
			const errorMessage = err.response?.data?.message;
			const statusCode = err.response?.status;

			// Error handling logic (keeping toasts set to bottom-left)
			if (statusCode === 401) {
				// Ensure toast is bottom-left
				toast.error(errorMessage || "Session expired. Please log in.", { position: "bottom-left" });
				navigate("/auth/login"); 
				return;
			} 
			
			if (statusCode === 400 && errorMessage) {
				const msgLower = errorMessage.toLowerCase();
				let fieldToTarget: keyof BlogForm | undefined = undefined;

				for (const [keyPhrase, fieldName] of serverErrorMap.entries()) {
						if (msgLower.includes(keyPhrase)) {
							fieldToTarget = fieldName;
							break;
						}
				}

				if (fieldToTarget) {
						form.setError(fieldToTarget, {
							type: "server",
							message: errorMessage,
						});
						// Ensure toast is bottom-left
						toast.error(`Validation failed: ${errorMessage}`, { position: "bottom-left" });
				} else {
						// Ensure toast is bottom-left
						toast.error(errorMessage, { position: "bottom-left" });
				}
			} 
			else {
				// Ensure toast is bottom-left
				toast.error(errorMessage || "Failed to create blog", { position: "bottom-left" });
			}
		},
	});

	const isSubmitting = mutation.isPending;
	const content = watch("content");
	const featuredImageUrl = watch("featuredImageUrl");


	return (
		// ADJUSTED: Padding for Navbar (pt-16) and Sidebar (pl-4)
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">

			<div className="max-w-6xl mx-auto py-8">
				
				{/* ---------------------------------- */}
				{/* HEADER AND CLEAR MESSAGE */}
				{/* ---------------------------------- */}
				<header className="mb-6">
					<h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text flex items-center">
						<PenTool className="w-8 h-8 mr-3 text-purple-600" /> Create New Blog Post
					</h1>
					<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
						Draft your story below. Your work is **auto-saved** to your browser.
					</p>
					<hr className="mt-4 border-gray-200 dark:border-gray-700" />
				</header>

				{/* 💡 Auto-Save Status Banner */}
				<div className={`flex items-center p-3 text-sm rounded-lg border mb-6 transition-all duration-300 ${
					isSaving 
						? "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-gray-800 dark:text-yellow-300"
						: "bg-green-50 text-green-800 border-green-200 dark:bg-gray-800 dark:text-green-300"
				}`}>
					<Save className={`w-4 h-4 mr-2 ${isSaving ? 'animate-pulse' : ''}`} />
					<span className="font-medium">
						Draft Status: {isSaving ? "Saving..." : "Saved to local storage."}
					</span>
					{!isSaving && getInitialValues().title && (
						<span className="ml-2 text-xs">Last draft loaded.</span>
					)}
				</div>
				

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

								{/* FEATURED IMAGE */}
								<div>
									<Label className="font-medium dark:text-gray-300">Featured Image</Label>
									<div className="mt-2 flex items-center gap-3">
										<Input
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="cursor-pointer border-dashed border-2 border-purple-400 hover:border-purple-500 dark:bg-slate-900 dark:text-gray-300"
										/>
									</div>
									<Input
										type="text"
										placeholder="Or enter image URL here (optional)"
										className="mt-2 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:border-slate-700"
										{...register("featuredImageUrl")}
									/>
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
										<Bot className="w-3 h-3 mr-1" /> The AI will suggest content improvements and append them below.
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
                                        placeholder="Let your words dance here... Use the rich text toolbar for formatting."
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
									<Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing...
								</>
							) : (
								"Publish Blog ✨"
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
                                                See your final layout and formatting in real-time.
                                            </p>
                                        </CardHeader>
                                        <CardContent className="pt-4 h-[calc(100%-120px)] overflow-y-auto blog-preview-content">
                                            
                                            {/* Display Title */}
                                            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                                                {watch("title") || "Untitled Draft"}
                                            </h2>

                                            {/* Display Featured Image */}
                                            {featuredImageUrl && (
                                                <img
                                                    src={featuredImageUrl}
                                                    alt="Blog featured image preview"
                                                    className="w-full max-h-64 object-cover rounded-lg mb-6 shadow-md"
                                                />
                                            )}

                                            {/* Display Content Preview - UPDATED LINE */}
                                            <div className="prose dark:prose-invert max-w-none">
                                                <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
                                                    {content || "Start typing your content in the editor to see the live rendering here..."}
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