import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, Link } from "react-router-dom";
import { 
    Wrench, 
    PlusCircle, 
    Lightbulb, 
    CornerUpLeft, 
    Trash2, // Added Trash2 icon for the header 
    Loader2, // Added Loader2 for professional loading
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

export default function Trash() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentFact, setCurrentFact] = useState(getRandomFact()); 

  const { data = [], isLoading } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await api.get("/profile/trash", { withCredentials: true });
      return res.data.blogs || []; // FIX: Use '|| []' to ensure an array is always returned on success, preventing potential issues if 'blogs' is null/undefined.
    },
  });

  const recoverMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/blogs/recover/${id}`, {}, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog recovered successfully!", { position: "bottom-left" }); // 💡 Toast Position
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Invalidate general blogs list
    },
    onError: () => {
        toast.error("Failed to recover blog.", { position: "bottom-left" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/blogs/permanent/${id}`, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Blog deleted permanently.", { position: "bottom-left" }); // 💡 Toast Position
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
    onError: () => {
        toast.error("Failed to delete blog permanently.", { position: "bottom-left" });
    }
  });

  // --- 1. Loading State ---
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

  // --- 2. Empty State (Enhanced) ---
  if (data.length === 0)
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
                        <Lightbulb className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        {currentFact}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click the box for a new tip!</p>
                </div>
            </div>
        </div>
    );

  // --- 3. Render List View ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">
        <div className="max-w-5xl mx-auto py-8">
            <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text flex items-center">
                <Trash2 className="w-7 h-7 mr-2 text-purple-600" /> Deleted Blogs (Trash)
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
                Items in the trash can be **Recovered** or **Deleted Permanently**.
            </p>
            
            <ScrollArea className="h-[75vh] pr-4"> 
                <div className="space-y-4">
                    {data.map((blog: any) => (
                        <Card
                            key={blog.id}
                            className="shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-slate-800 border-l-4 border-red-500"
                        >
                            <CardHeader className="flex flex-row justify-between items-start p-4 pb-2">
                                <div>
                                    <h2 className="font-bold text-xl line-clamp-1">{blog.title}</h2>
                                    <small className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                        <Wrench className="w-3 h-3 mr-1" /> Deleted:{" "}
                                        {new Date(
                                            blog.lastUpdated || blog.createdAt,
                                        ).toLocaleDateString()}
                                    </small>
                                </div>
                                <p className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full mt-1">
                                    Awaiting Deletion
                                </p>
                            </CardHeader>
                            <CardFooter className="flex justify-end gap-3 p-4 pt-2">
                                <Button
                                    className="bg-gradient-to-r from-green-500 to-teal-400 text-white hover:opacity-90 shadow-md shadow-green-500/30"
                                    onClick={() => recoverMutation.mutate(blog.id)}
                                    disabled={recoverMutation.isPending || deleteMutation.isPending}
                                >
                                    {recoverMutation.isPending ? "Recovering..." : "Recover"}
                                </Button>
                                <Button
                                    className="bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/30"
                                    onClick={() => deleteMutation.mutate(blog.id)}
                                    disabled={deleteMutation.isPending || recoverMutation.isPending}
                                >
                                    {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
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