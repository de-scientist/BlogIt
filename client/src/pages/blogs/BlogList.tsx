import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { useState } from "react"; 
import {
  Card,
  CardFooter,
  CardContent, // 💡 Added CardContent for better structure
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    PenTool, 
    Search, 
    PlusCircle, 
    CornerUpLeft, 
    Lightbulb, 
    Loader2, // 💡 Added Loader2 icon for professional loading state
} from "lucide-react"; 

// 💡 Simple list of fun facts (for the empty state)
const facts = [
  "💡 Did you know: Bloggers often read other blogs for inspiration before writing!",
  "💡 The average attention span of an internet user reading a blog post is only 6 seconds. Make your first line count!",
  "💡 SEO (Search Engine Optimization) is key to getting your blog seen by the world. Use good keywords!",
  "💡 Consistency is the most important trait of a successful blogger.",
];
// Function to get a random fact
const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

export default function BlogList() {
  const [currentFact, setCurrentFact] = useState(getRandomFact()); 

  const { data, isLoading, isError } = useQuery({ // 💡 Added isError for robust handling
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs", { withCredentials: true });
      return Array.isArray(res.data.blogs) ? res.data.blogs : [];
    },
  });

  // --- 1. Loading State (Improved) ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center">
        <Loader2 className="w-8 h-8 mr-2 text-purple-600 animate-spin" />
        <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
          Loading amazing stories...
        </p>
      </div>
    );
  }
    
  // --- 2. Error State ---
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 flex justify-center items-center p-8">
                <Card className="p-8 text-center shadow-xl dark:bg-slate-800 border-red-500 border-l-4">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">
                        Connection Error 🔌
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Failed to fetch blog posts. Please check your network connection or try again later.
                    </p>
                </Card>
            </div>
        );
    }

  return (
    // 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar) to the main container
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">
        <div className="max-w-6xl mx-auto py-8">
      {data.length === 0 ? (
        // 🔹 ENHANCED EMPTY STATE UI/UX (Centered and polished)
        <div className="max-w-xl mx-auto py-16 px-8 bg-white dark:bg-slate-800 rounded-xl shadow-2xl text-center border-t-4 border-purple-600">
          <PenTool className="w-12 h-12 mx-auto text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Your Canvas Awaits
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            There are **no blogs** to display yet. Be the first to share your voice!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            {/* Create Blog Button (Primary Gradient) */}
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold hover:opacity-90 transition-all shadow-md shadow-green-500/30"
            >
              <Link to="/blogs/create">
                <PlusCircle className="w-5 h-5 mr-2" /> Start a New Blog
              </Link>
            </Button>
            
            {/* Go to Dashboard Button (Secondary Outline) */}
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click the box for a new writing tip!</p>
          </div>
        </div>
      ) : (
        // 🔹 BLOG LIST VIEW (Enhanced Layout)
        <>
            <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text flex items-center">
                <Search className="w-7 h-7 mr-3 text-purple-600" /> Explore Stories
            </h1>
            
            <ScrollArea className="h-[80vh]">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                    {data.map((blog: any) => (
                        <Card
                            key={blog.id}
                            className="rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700 dark:bg-slate-900 
                            hover:shadow-purple-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                        >
                            {/* Card Image */}
                            {blog.featuredImageUrl && (
                                <div className="w-full h-48 overflow-hidden">
                                    <img
                                        src={blog.featuredImageUrl}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                            )}

                            {/* Card Content */}
                            <CardContent className="p-4"> 
                                <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100 line-clamp-2">
                                    {blog.title}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                                    {blog.synopsis}
                                </p>
                                
                                <small className="block text-xs text-gray-500 dark:text-gray-500">
                                    By **{blog.user.firstName} {blog.user.lastName}** •{" "}
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </small>
                            </CardContent>

                            {/* Card Footer */}
                            <CardFooter className="flex justify-between p-4 border-t border-gray-100 dark:border-slate-700">
                                <Link to={`/blogs/edit/${blog.id}`} rel="noopener">
                                    <Button
                                        variant="outline"
                                        className="text-sm font-semibold border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors"
                                    >
                                        Edit
                                    </Button>
                                </Link>

                                <Link to={`/blogs/view/${blog.id}`} rel="noopener">
                                    <Button 
                                        className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/50 hover:opacity-90"
                                    >
                                        Read More
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </>
      )}
    </div>
  </div>
  );
}