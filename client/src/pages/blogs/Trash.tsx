import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle, // Added CardTitle for better structure
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, Link } from "react-router-dom";
import { 
    CornerUpLeft, 
    Trash2, 
    PlusCircle,
    Loader2,
    Clock, // New icon for deletion time
    RotateCcw, // New icon for recovery action
} from "lucide-react"; 
import { useState } from "react"; 

// 💡 Simple list of fun facts
const facts = [
    "💡 Did you know: Blog is a shortened version of 'weblog'?",
    "💡 A single deleted file can remain recoverable on a hard drive for years!",
    "💡 The first true weblog was arguably created in 1994 by Justin Hall.",
    "💡 Deleting items to the trash folder does not free up storage space until you empty it.",
];
// Function to get a random fact
const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

// 💡 TYPE DEFINITION for Blog (Matching Dashboard for consistency)
interface Blog {
    id: number | string;
    title: string;
    category?: string;
    status: 'draft' | 'published' | 'trashed'; // Explicit 'trashed' status is assumed
    views?: number;
    createdAt: string;
    synopsis?: string;
    content: string;
    featuredImageUrl?: string;
    lastUpdated?: string; // To use for deletion time if available
}

export default function Trash() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [currentFact, setCurrentFact] = useState(getRandomFact()); 

    const { data, isLoading } = useQuery<Blog[]>({ // Explicitly type data as Blog[]
        queryKey: ["trash"],
        queryFn: async () => {
            const res = await api.get("/profile/trash", { withCredentials: true });
            return res.data.blogs || []; 
        },
    });
    
    // Ensure data is treated as an array of Blog objects
    const blogsInTrash: Blog[] = Array.isArray(data) ? data : [];


    // 1. RECOVER MUTATION
    const recoverMutation = useMutation({
        mutationFn: (id: string) =>
            api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
        onSuccess: () => {
            toast.success("Blog recovered successfully!", { position: "bottom-left" }); 
            queryClient.invalidateQueries({ queryKey: ["trash"] });
            queryClient.invalidateQueries({ queryKey: ["blogs"] }); 
        },
        onError: () => {
            toast.error("Failed to recover blog. Please try again.", { position: "bottom-left" });
        }
    });

    // 2. PERMANENT DELETE MUTATION
    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            api.delete(`/blogs/permanent/${id}`, { withCredentials: true }),
        onSuccess: () => {
            toast.success("Blog deleted permanently. Space freed!", { position: "bottom-left" }); 
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
        onError: () => {
            toast.error("Failed to delete blog permanently. Check connection.", { position: "bottom-left" });
        }
    });

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center">
                <Loader2 className="w-8 h-8 mr-2 text-purple-600 animate-spin" />
                <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
                    Loading trash bin contents...
                </p>
            </div>
        );
    }

    // --- Empty State (Enhanced) ---
    if (blogsInTrash.length === 0)
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 pb-10 flex justify-center items-start">
                <div className="max-w-xl mx-auto mt-12 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-2xl text-center border-t-4 border-purple-600">
                    <div className="mb-6">
                        <Trash2 className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                        <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                            Trash Bin is Empty
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                            Congratulations! There are no deleted items awaiting review.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold hover:opacity-90 transition-all shadow-md shadow-green-500/30"
                        >
                            <Link to="/blogs/create">
                                <PlusCircle className="w-5 h-5 mr-2" /> Start a New Blog
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                            <Link to="/dashboard">
                                <CornerUpLeft className="w-5 h-5 mr-2" /> Go to Dashboard
                            </Link>
                        </Button>
                    </div>

                    {/* Interactive Fact (Polished) */}
                    <div 
                        className="mt-6 p-4 bg-purple-50 dark:bg-slate-700 border border-purple-200 dark:border-purple-800 rounded-lg cursor-pointer transition hover:bg-purple-100 dark:hover:bg-slate-600 text-left"
                        onClick={() => setCurrentFact(getRandomFact())} 
                        title="Click to see another fact"
                    >
                        <p className="font-semibold text-purple-800 dark:text-purple-300 flex items-start">
                            <Clock className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" /> {/* Changed icon for better context */}
                            **Insight:** {currentFact}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click the box for a new tip!</p>
                    </div>
                </div>
            </div>
        );

    // --- Render List View (Improved UI/UX) ---
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">
            <div className="max-w-5xl mx-auto py-8 px-6">
                <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text flex items-center">
                    <Trash2 className="w-7 h-7 mr-3 text-purple-600" /> Deleted Blogs
                </h2>
                <p className="mb-8 text-gray-600 dark:text-gray-400 text-lg">
                    These items are scheduled for permanent deletion. **Restore** or **Erase** them now.
                </p>
                
                {/* ScrollArea for fixed height list */}
                <ScrollArea className="h-[75vh] pr-4"> 
                    {/* Grid Layout matching Dashboard style */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* KEY CHANGE 1: Destructure index and use it as a fallback key if blog.id is falsy */}
                        {blogsInTrash.map((blog: Blog, index: number) => (
                            <Card
                                key={blog.id ? String(blog.id) : `fallback-${index}`}
                                className="bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:border-red-500 transition-all duration-300 rounded-xl overflow-hidden"
                            >
                                {/* Featured Image (from Dashboard style) */}
                                {blog.featuredImageUrl && (
                                    <img 
                                        src={blog.featuredImageUrl} 
                                        alt={`Featured image for ${blog.title}`}
                                        className="w-full h-40 object-cover opacity-60 grayscale" // Desaturated and dimmed to indicate 'trashed' state
                                        onError={(e) => { 
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                                            {blog.title}
                                        </CardTitle>
                                        
                                        <div className="text-sm text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full whitespace-nowrap">
                                            TRASHED
                                        </div>
                                    </div>
                                    
                                    {/* Synopsis/Content preview */}
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed text-sm">
                                        {blog.synopsis || blog.content}
                                    </p>
                                    
                                    {/* Deletion Date/Time Info (KEY CHANGE 2: Added toLocaleTimeString) */}
                                    <div className="pt-2">
                                        <small className="text-gray-500 dark:text-gray-400 flex items-center text-xs font-medium">
                                            <Clock className="w-3 h-3 mr-1 text-red-500" /> 
                                            Deleted on: 
                                            {/* 💡 NOW INCLUDES TIME */}
                                            {new Date(blog.lastUpdated || blog.createdAt).toLocaleDateString()} at {new Date(blog.lastUpdated || blog.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                    </div>

                                </CardContent>
                                
                                {/* Recovery/Delete Actions */}
                                <CardFooter className="flex justify-between gap-4 p-6 pt-0 border-t border-gray-100 dark:border-slate-700">
                                    <Button
                                        onClick={() => recoverMutation.mutate(blog.id as string)}
                                        disabled={recoverMutation.isPending || deleteMutation.isPending}
                                        className="w-1/2 bg-gradient-to-r from-green-500 to-teal-400 text-white hover:opacity-90 shadow-lg shadow-green-500/30 rounded-full"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" /> 
                                        {recoverMutation.isPending ? "Restoring..." : "Recover"}
                                    </Button>

                                    <Button
                                        onClick={() => deleteMutation.mutate(blog.id as string)}
                                        disabled={deleteMutation.isPending || recoverMutation.isPending}
                                        className="w-1/2 bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 rounded-full"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {deleteMutation.isPending ? "Erasing..." : "Delete Permanently"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
} 