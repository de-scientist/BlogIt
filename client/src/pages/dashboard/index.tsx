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
    img: "/images/colors.jpeg",
    excerpt:
      "A playful splash of art, design, and unfiltered imagination.",
  },
  {
    id: "s3",
    title: "Dear Future Self…",
    img: "/images/self.jpeg",
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

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto pt-16 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-orange-300 drop-shadow-lg">
          Discover. Create. Share Stories.
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
          Step into a living canvas of voices and ideas. Explore stories from creators worldwide — find your spark, then write your own masterpiece.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/dashboard/blogs")}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-10 py-6 rounded-xl transition-all hover:scale-105"
        >
          Start Writing
        </Button>
      </section>

      {/* FEATURED / DISCOVERABLE BLOGS */}
      <section className="max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-3xl font-bold mb-6 text-orange-300">
          Featured Stories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              <img
                src={blog.img}
                alt={blog.title}
                className="h-52 w-full object-cover"
              />

              <CardContent className="p-5">
                <h3 className="text-xl font-semibold text-orange-300 mb-1">
                  {blog.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                  {blog.excerpt}
                </p>

                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold w-full"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto border-b border-gray-700 my-16"></div>

      {/* USER BLOGS */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-blue-300">
          Your Blogs
        </h2>

        {isLoading && (
          <p className="text-gray-400">Loading your blogs…</p>
        )}

        {!isLoading && blogs.length === 0 && (
          <p className="text-gray-400 text-lg">
            You haven’t created any blogs yet — your voice is waiting to be heard.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {blogs.map((blog: any) => (
            <Card
              key={blog.id}
              className="bg-gray-900/80 border border-gray-800 shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-5">
                <h3 className="text-xl font-bold text-blue-300">
                  {blog.title}
                </h3>

                <p className="text-gray-300 mt-2 line-clamp-3">
                  {blog.content}
                </p>

                <div className="flex flex-col gap-3 mt-5">
                  <Link to={`/blogs/view/${blog.id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 w-full">
                      Read More
                    </Button>
                  </Link>

                  <div className="flex gap-3">
                    <Link to={`/dashboard/edit/${blog.id}`} className="w-full">
                      <Button className="bg-gray-700 hover:bg-gray-600 w-full">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 mt-20">
        Built with passion  
        <a
          href="https://github.com/de-scientist"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:text-orange-500 ml-2"
        >
          Explore my GitHub →
        </a>
      </footer>

    </main>
  );
}
