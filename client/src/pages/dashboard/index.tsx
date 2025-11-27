import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // 💡 Added CardTitle, CardHeader
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Pencil, Eye, Trash2, Zap, LayoutDashboard, PlusCircle } from "lucide-react"; // 💡 Added icons

// --- Interactive Fact Data ---
const facts = [
  "Blogging Fact: Content with images gets 94% more views than content without.",
  "Blogging Fact: The optimal blog post length for SEO is often cited as 1,500–2,000 words.",
  "Blogging Fact: Consistency in publishing is more important than post length for audience retention.",
  "Blogging Fact: Blog posts that ask a question in the title receive 50% more clicks.",
];
const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

// --- Helper function to mock quick stats (since we only fetch blogs) ---
const mockQuickStats = (blogs: any[]) => ({
    totalBlogs: blogs.length,
    drafts: blogs.filter((b: any) => b.status === 'draft').length, // Assuming a 'status' field
    published: blogs.filter((b: any) => b.status === 'published').length,
    totalViews: blogs.reduce((acc: number, b: any) => acc + (b.views || 0), 0), // Assuming a 'views' field
});

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentFact, setCurrentFact] = useState(getRandomFact()); // 💡 State for interactive fact

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
  });

  // Normalize data and apply mock stats
  const blogs = Array.isArray(data) ? data : data?.blogs || [];
  const stats = mockQuickStats(blogs);


  // DELETE BLOG MUTATION (No functional change)
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) =>
      (await api.patch(`/profile/trash/${id}`)).data,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Updated query syntax
    },
  });

  const handleDelete = (id: number) => {
    deleteBlogMutation.mutate(id);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-20 pt-16 pl-5">
      {/* 💡 pt-16 for Navbar, pl-64 for Sidebar */}
      
      {/* HERO / HEADER SECTION */}
      <header className="max-w-4xl mx-auto py-10 px-6 space-y-3">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
              <LayoutDashboard className="inline w-10 h-10 mr-3 align-middle" /> Your Dashboard
            </h1>

            {/* Main CTA */}
            <Button
              size="lg"
              onClick={() => navigate("/blogs/create")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all text-white font-semibold rounded-full px-8 py-3 shadow-xl shadow-purple-500/30"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> New Blog
            </Button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Welcome back! Here's a quick overview of your creative portfolio.
        </p>
      </header>
      
      {/* ---------------------------------- */}
      {/* SECTION 2: QUICK STATS */}
      {/* ---------------------------------- */}
      <section className="max-w-4xl mx-auto mt-6 px-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="shadow-lg border-l-4 border-indigo-500 dark:bg-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                      <Pencil className="w-5 h-5 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBlogs}</div>
                      <p className="text-xs text-gray-500">All time</p>
                  </CardContent>
              </Card>
              <Card className="shadow-lg border-l-4 border-green-500 dark:bg-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Published</CardTitle>
                      <Eye className="w-5 h-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stats.published}</div>
                      <p className="text-xs text-gray-500">Live for the world</p>
                  </CardContent>
              </Card>
              <Card className="shadow-lg border-l-4 border-yellow-500 dark:bg-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                      <Pencil className="w-5 h-5 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stats.drafts}</div>
                      <p className="text-xs text-gray-500">Waiting to be finished</p>
                  </CardContent>
              </Card>
               <Card className="shadow-lg border-l-4 border-pink-500 dark:bg-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      <Eye className="w-5 h-5 text-pink-500" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stats.totalViews}</div>
                      <p className="text-xs text-gray-500">Audience reached</p>
                  </CardContent>
              </Card>
          </div>
      </section>

      {/* ---------------------------------- */}
      {/* SECTION 3: INTERACTIVE FACT */}
      {/* ---------------------------------- */}
      <section className="max-w-4xl mx-auto px-6 mt-8">
          <div 
            className="p-5 bg-gradient-to-r from-yellow-50 to-orange-100 dark:from-slate-700 dark:to-slate-800 rounded-xl shadow-inner border border-yellow-200 dark:border-slate-600 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setCurrentFact(getRandomFact())} 
            title="Click to discover another blogging insight!"
          >
            <p className="flex items-center justify-center text-lg font-medium text-orange-800 dark:text-orange-300">
              <Zap className="w-6 h-6 mr-3 text-orange-600 animate-pulse" />
              **Blogging Insight:** {currentFact}
            </p>
          </div>
      </section>

      <div className="max-w-4xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Your Recent Creations
        </h2>

        {isLoading && <p className="text-gray-500">Loading your blogs…</p>}

        {/* ---------------------------------- */}
        {/* EMPTY STATE (Improved) */}
        {/* ---------------------------------- */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl shadow-xl border-t-4 border-purple-600">
            <Pencil className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
              No Blogs Found
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Your dashboard is empty! Click the button below to start sharing your voice and ideas with the world.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/blogs/create")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full shadow-lg hover:opacity-90 transition-all"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Write Your First Story
            </Button>
          </div>
        )}

        {/* ---------------------------------- */}
        {/* BLOG GRID (Improved Card Design) */}
        {/* ---------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogs.map((blog: any) => (
            <Card
              key={blog.id}
              className="bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300 rounded-2xl overflow-hidden"
            >
                {/* 💡 FEATURED IMAGE ADDED HERE */}
                {blog.featuredImageUrl && (
                    <img 
                        src={blog.featuredImageUrl} 
                        alt={`Featured image for ${blog.title}`}
                        className="w-full h-40 object-cover" 
                        onError={(e) => { 
                            // Fallback for broken images (e.g., if the URL is invalid)
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                )}
                {/* --------------------------- */}
              <CardContent className="p-6 space-y-4">
                {/* Title and Date */}
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {blog.title}
                    </h3>
                    <small className="text-gray-500 text-xs text-right whitespace-nowrap">
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </small>
                </div>

                {/* Synopsis / Content Preview */}
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed text-sm">
                  {blog.synopsis || blog.content}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-700">
                  <Link to={`/blogs/view/${blog.id}`}>
                    <Button 
                        variant="outline"
                        className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full"
                    >
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                  </Link>

                  <div className="flex gap-3">
                    <Link to={`/blogs/edit/${blog.id}`}>
                      <Button className="px-4 text-sm bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full shadow hover:opacity-90">
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </Link>

                    <Button
                      onClick={() => handleDelete(blog.id)}
                      className="px-4 text-sm bg-red-600 hover:bg-red-700 text-white rounded-full shadow"
                      disabled={deleteBlogMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}