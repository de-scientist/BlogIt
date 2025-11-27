import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenTool, Search } from "lucide-react"; // 💡 Added icons for better context

export default function BlogList() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs", { withCredentials: true });
      return Array.isArray(res.data.blogs) ? res.data.blogs : [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <p className="text-xl font-medium text-gray-500 animate-pulse">
          Loading amazing stories...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      {data.length === 0 ? (
        // 🔹 EMPTY STATE UI/UX IMPROVEMENT
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl shadow-xl border-t-4 border-purple-600">
          <PenTool className="w-12 h-12 mx-auto text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Your Canvas Awaits
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            There are no blogs to display. Start sharing your voice!
          </p>
          <Link to="/blogs/create" rel="noopener">
            <Button
              className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-teal-400 text-white shadow-lg shadow-green-500/50 hover:opacity-90 transition-all duration-200"
            >
              Create Your First Blog ✨
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="h-[88vh] pr-4">
          <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            <Search className="inline w-7 h-7 mr-2" /> Explore Stories
          </h1>

          {/* Pinterest-style grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
            {data.map((blog: any) => (
              // 🔹 CARD UI/UX IMPROVEMENT
              <Card
                key={blog.id}
                className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700 dark:bg-slate-900 
                hover:shadow-purple-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {blog.featuredImageUrl && (
                  <div className="w-full h-48 overflow-hidden">
                      <img
                        src={blog.featuredImageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                    {blog.synopsis}
                  </p>
                  
                  {/* Metadata */}
                  <small className="block text-xs text-gray-500 dark:text-gray-500">
                    By **{blog.user.firstName} {blog.user.lastName}** •{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <CardFooter className="flex justify-between p-4 border-t border-gray-100 dark:border-slate-700">
                  {/* Edit Button - Outline with gradient text */}
                  <Link to={`/blogs/edit/${blog.id}`} rel="noopener">
                    <Button
                      variant="outline"
                      className="text-sm font-semibold border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors"
                    >
                      Edit
                    </Button>
                  </Link>

                  {/* View Button - Primary Gradient */}
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
      )}
    </div>
  );
}