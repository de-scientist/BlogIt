import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
  });

  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pt-20  pb-20">
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto pt-10 px-6 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-lg">
          Your Creative Space
        </h1>

        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Every idea deserves a place to bloom. Explore your creations below —
          refine them, expand them, or craft something new.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/blogs/create")}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all text-white font-semibold rounded-xl px-10 py-4 shadow-xl"
        >
          Create New Blog
        </Button>
      </section>

      {/* USER BLOGS */}
      <section className="max-w-6xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-purple-700">Your Blogs</h2>

        {isLoading && <p className="text-gray-500">Loading your blogs…</p>}

        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-6">
              You haven’t created any blogs yet.
              <br />
              Your voice is waiting to step into the light.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/blogs/create")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-xl shadow-lg hover:opacity-90 transition-all"
            >
              Write Your First Story
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog: any) => (
            <Card
              key={blog.id}
              className="bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-2xl transition-all"
            >
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-purple-700">
                  {blog.title}
                </h3>

                <p className="text-gray-600 mt-3 line-clamp-3">
                  {blog.content}
                </p>

                <div className="flex flex-col gap-3 mt-6">
                  <Link to={`/blogs/view/${blog.id}`}>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white w-full">
                      Read More
                    </Button>
                  </Link>

                  <div className="flex gap-3">
                    <Link to={`/blogs/edit/${blog.id}`} className="w-full">
                      <Button className="bg-gray-200 hover:bg-gray-300 w-full text-gray-800">
                        Edit
                      </Button>
                    </Link>

                    <Button variant="destructive" className="w-full">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </main>
  );
}
