import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";

// Dummy discoverable blogs (Pinterest-inspired)
const sampleBlogs = [
  {
    id: "s1",
    title: "The Midnight Train of Thoughts",
    img: "https://i.pinimg.com/564x/33/2d/5c/332d5cdb7f9019da5aa5f91d0261f973.jpg",
    excerpt:
      "A short dive into the mind’s quiet storms… where ideas glow in the dark.",
  },
  {
    id: "s2",
    title: "Colors, Chaos & Creation",
    img: "https://i.pinimg.com/564x/9b/84/ae/9b84ae513c86a93a1d1399f6ee67acbb.jpg",
    excerpt:
      "A playful splash of art, design, and unfiltered imagination.",
  },
  {
    id: "s3",
    title: "Dear Future Self…",
    img: "https://i.pinimg.com/564x/b3/15/3c/b3153cc9ad412cc4ce4df0ffb7fdc65a.jpg",
    excerpt:
      "A letter to the dream-chaser you’re becoming.",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
  });

  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto pt-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-pink-400">
          Discover. Create. Share Stories.
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6">
          Step into a world shaped by creators everywhere. Preview stories,
          draw inspiration, then write your own.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/dashboard/blogs")}
          className="bg-blue-500 hover:bg-blue-600 font-semibold px-8 py-6 rounded-xl transition-all hover:scale-105"
        >
          Create Your First Blog
        </Button>
      </section>

      {/* Featured Blogs (Dummy Discoverable Section) */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h2 className="text-2xl font-bold mb-4 text-pink-300">
          Featured Stories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="relative group bg-gray-900 border border-gray-800 hover:scale-[1.02] transition-all duration-300 overflow-hidden shadow-xl"
            >
              <img
                src={blog.img}
                alt={blog.title}
                className="h-44 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-pink-400 mb-1">
                  {blog.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {blog.excerpt}
                </p>
              </CardContent>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-b border-gray-700 my-12"></div>

      {/* User Blogs Section */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">
          Your Blogs
        </h2>

        {isLoading && <p className="text-gray-400">Loading your blogs…</p>}

        {!isLoading && blogs.length === 0 && (
          <p className="text-gray-400">
            You haven’t created any blogs yet. Start something beautiful.
          </p>
        )}

        {/* Actual blogs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {blogs.map((blog: any) => (
            <Card
              key={blog.id}
              className="group bg-gray-900 border border-gray-800 hover:scale-[1.02] transition-all duration-300 overflow-hidden shadow-xl"
            >
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-pink-400">
                  {blog.title}
                </h3>
                <p className="text-gray-300 line-clamp-3 mt-2">
                  {blog.content}
                </p>
              </CardContent>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition duration-300">
                <Link to={`/dashboard/edit/${blog.id}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive">Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
     <footer className="text-center text-gray-500 mt-16">
  Built with passion.  
  <a
    href="https://github.com/de-scientist"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 hover:text-blue-500 ml-2"
  >
    Visit my GitHub →
  </a>
</footer>

    </main>
  );
}
