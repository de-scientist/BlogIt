import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { useState } from "react"; 
import {
  Card,
  CardFooter,
  CardContent, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"; // 💡 Import Input component
import { 
    PenTool, 
    Search, 
    PlusCircle, 
    CornerUpLeft, 
    Lightbulb, 
    Loader2, 
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

// 💡 NEW FilterComponent (Reused and adapted from Dashboard.jsx)
const FilterComponent = ({ filter, setFilter, blogs }) => {
    const categories = ['Poetry', 'Health', 'Academics'];
    
    const isFilterActive = filter.trim() !== '';

    return (
        <div className="mb-8 space-y-4">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search by category or keyword (e.g., 'Poetry', 'Health')"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-full dark:bg-slate-800 focus:border-purple-500 transition-colors"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mr-2">Quick Filters:</span>
                {categories.map(cat => (
                    <Button
                        key={cat}
                        size="sm"
                        onClick={() => setFilter(filter.toLowerCase() === cat.toLowerCase() ? '' : cat)}
                        className={`rounded-full px-4 py-1 text-sm transition-all ${
                            filter.toLowerCase() === cat.toLowerCase()
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                        }`}
                        variant="ghost" 
                    >
                        {cat}
                    </Button>
                ))}
                
                {/* Clear Filter Button */}
                {isFilterActive && (
                    <Button
                        size="sm"
                        onClick={() => setFilter('')}
                        className="rounded-full px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                        Clear Filter
                    </Button>
                )}
            </div>
            
            {/* Filter Status Message */}
            {isFilterActive && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {blogs.length} stories matching **'{filter}'**
                </p>
            )}
        </div>
    );
};


export default function BlogList() {
  const [currentFact, setCurrentFact] = useState(getRandomFact()); 
  // 💡 NEW STATE: Filter for category/name
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data, isLoading, isError } = useQuery({ 
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs", { withCredentials: true });
      return res.data.blogs || []; 
    },
  });

  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  // 💡 NEW LOGIC: Filter the blogs based on the categoryFilter
  const filteredBlogs = blogs.filter((blog: any) => {
      if (!categoryFilter) return true;
      const lowerCaseFilter = categoryFilter.toLowerCase();
      
      // Assuming 'category' is a field on the blog object, defaulting to checking the title if category is missing
      const categoryMatch = blog.category?.toLowerCase().includes(lowerCaseFilter) || false;
      const titleMatch = blog.title?.toLowerCase().includes(lowerCaseFilter) || false;
      
      return categoryMatch || titleMatch;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 pl-4 pb-10">
        <div className="max-w-6xl mx-auto py-8">
      {blogs.length === 0 ? ( 
        // 🔹 ENHANCED EMPTY STATE UI/UX 
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
            
            {/* 💡 CATEGORY FILTER ADDED HERE */}
            <FilterComponent 
                filter={categoryFilter}
                setFilter={setCategoryFilter}
                blogs={filteredBlogs}
            />
            {/* ------------------------------- */}
            
            <ScrollArea className="h-[80vh]">
            
                {/* ---------------------------------- */}
                {/* EMPTY STATE FOR FILTERED BLOGS */}
                {/* ---------------------------------- */}
                {filteredBlogs.length === 0 && (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl border-t-4 border-purple-600 max-w-2xl mx-auto">
                        <Search className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                            No Stories Found
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            The category **'{categoryFilter}'** has no matching stories. Try searching for a different keyword.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => setCategoryFilter('')}
                            className="bg-red-500 text-white px-10 py-4 rounded-full shadow-lg hover:bg-red-600 transition-all"
                        >
                            Clear Filter
                        </Button>
                    </div>
                )}
                
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                    {filteredBlogs.map((blog: any) => ( // 💡 MAPPING filteredBlogs
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