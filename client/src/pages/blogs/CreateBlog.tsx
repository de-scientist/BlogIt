import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // 💡 Added CardTitle
import { useState, useEffect } from "react"; 
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Loader2, Save, PenTool, Eye } from "lucide-react"; // 💡 Added icons
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Assuming you have a Tabs component

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
		localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear bad data
	}
	// Default empty state if nothing is stored or storage fails
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
	const [isSaving, setIsSaving] = useState(false); // State for draft saving notification

	const form = useForm<BlogForm>({
		defaultValues: getInitialValues(),
	});

	// 💡 PERSISTENCE: Save form data to local storage on change
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const subscription = form.watch((value) => {
			// Clear any previous debounce timer
			clearTimeout(timeoutId);
			setIsSaving(true); // Show saving indicator

			timeoutId = setTimeout(() => {
				// Save the current form values (draft) after a short delay
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
				setIsSaving(false); // Hide saving indicator
				// Optional toast for auto-save confirmation
				// toast.info("Draft saved locally.", { position: "bottom-left", duration: 1500 }); 
			}, 1000); // 1-second debounce

			return () => clearTimeout(timeoutId);
		});

		// Unsubscribe when the component unmounts
		return () => subscription.unsubscribe();
	}, [form]);


	// 💡 IMAGE UPLOAD
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const toastId = toast.loading("Uploading image...", { position: "bottom-left" }); // 💡 Set toast position

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
				form.setValue("featuredImageUrl", result.secure_url, { shouldValidate: true }); 
				toast.success("Image uploaded!", { position: "bottom-left" }); // 💡 Set toast position
			} else {
				toast.error("Failed to upload image", { position: "bottom-left" }); // 💡 Set toast position
			}
		} catch {
			toast.error("Upload error", { position: "bottom-left" }); // 💡 Set toast position
		} finally {
			setUploading(false);
			toast.dismiss(toastId);
		}
	};

	const mutation = useMutation({
		mutationFn: (newBlog: BlogForm) =>
			api.post("/blogs", newBlog, { withCredentials: true }),
		onSuccess: () => {
			// SUCCESS: Clear the local storage draft
			localStorage.removeItem(LOCAL_STORAGE_KEY); 
			
			toast.success("Blog created successfully", { position: "bottom-left" }); // 💡 Set toast position
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			navigate("/blogs");
		},
		onError: (err: any) => {
			const errorMessage = err.response?.data?.message;
			const statusCode = err.response?.status;

			if (statusCode === 401) {
				toast.error(errorMessage || "Session expired. Please log in.", { position: "bottom-left" }); // 💡 Set toast position
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
						toast.error(`Validation failed: ${errorMessage}`, { position: "bottom-left" }); // 💡 Set toast position
				} else {
						toast.error(errorMessage, { position: "bottom-left" }); // 💡 Set toast position
				}
			} 
			else {
				toast.error(errorMessage || "Failed to create blog", { position: "bottom-left" }); // 💡 Set toast position
			}
		},
	});

	const isSubmitting = mutation.isPending;
	const content = form.watch("content");
	const featuredImageUrl = form.watch("featuredImageUrl");


	return (
		// 💡 ADJUSTED: Padding for Navbar (pt-16) and Sidebar (pl-4)
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

				{/* 💡 NEW: Auto-Save Status Banner */}
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
										{...form.register("title", { required: "Title is required" })}
									/>
									{form.formState.errors.title && (
										<p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
									)}
								</div>

								{/* SYNOPSIS */}
								<div>
									<Label htmlFor="synopsis" className="font-medium dark:text-gray-300">Synopsis</Label>
									<Input
										id="synopsis"
										placeholder="A short teaser that hooks your audience..."
										className="mt-1 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:border-slate-700"
										{...form.register("synopsis", { required: "Synopsis is required" })}
									/>
									{form.formState.errors.synopsis && (
										<p className="text-sm text-red-500">{form.formState.errors.synopsis.message}</p>
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
									{/* Display current image URL input (Optional: for direct link entry) */}
									<Input
										type="text"
										placeholder="Or enter image URL here (optional)"
										className="mt-2 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:border-slate-700"
										{...form.register("featuredImageUrl")}
									/>
									{featuredImageUrl && (
										<img
											src={featuredImageUrl}
											alt="Featured image preview"
											className="w-full h-40 object-cover rounded-md mt-4 shadow"
										/>
									)}
									{form.formState.errors.featuredImageUrl && (
										<p className="text-sm text-red-500 mt-2">
											{form.formState.errors.featuredImageUrl.message}
										</p>
									)}
								</div>
								
								{/* CONTENT TEXTAREA */}
								<div>
									<Label htmlFor="content" className="font-medium dark:text-gray-300">
										Content (Markdown supported)
									</Label>
									<Textarea
										id="content"
										placeholder="Let your words dance here... Use Markdown for formatting."
										{...form.register("content", { required: "Content is required" })}
										className="h-64 mt-1 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:border-slate-700"
									/>
									{form.formState.errors.content && (
										<p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* SUBMIT BUTTON */}
						<Button
							disabled={isSubmitting || uploading}
							className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition-all rounded-xl flex justify-center items-center shadow-lg"
							onClick={form.handleSubmit((values) => mutation.mutate(values))}
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
									See your final layout and markdown formatting in real-time.
								</p>
							</CardHeader>
							<CardContent className="pt-4 h-[calc(100%-120px)] overflow-y-auto blog-preview-content">
								
								{/* Display Title */}
								<h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
									{form.watch("title") || "Untitled Draft"}
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
										{content || "Start typing your content in the editor to see the live markdown rendering here..."}
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