import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
  });

  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  // Top 3 blogs slideshow
  const topBlogs = blogs.slice(0, 3);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topBlogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topBlogs.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? topBlogs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % topBlogs.length);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-900 text-white">
      {/* Hero & CTA */}
      <div className="max-w-6xl mx-auto mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-400 mb-4">
          Discover, Create & Share Stories
        </h1>
        <p className="text-gray-300 max-w-3xl mb-6">
          Explore top blogs from creators worldwide. Get inspired, engage, and start sharing your own stories today.
        </p>
        <Button
          type="button"
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
          onClick={() => navigate("/dashboard/blogs")}
        >
          Create Your Blog
        </Button>
      </div>

      {/* Top Blogs Slideshow */}
      {topBlogs.length > 0 && (
        <div className="relative max-w-6xl mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl">
          {topBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={blog.featuredImageUrl || "https://i.pinimg.com/564x/placeholder.jpg"}
                alt={blog.title}
                className="w-full h-64 md:h-80 object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{blog.title}</h2>
                <p className="text-gray-200 line-clamp-2">{blog.content}</p>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button
            type="button"
            title="Previous Slide"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800/50 rounded-full hover:bg-gray-800/70 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            title="Next Slide"
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800/50 rounded-full hover:bg-gray-800/70 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Blog Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <p className="text-gray-400 col-span-full">Loading blogs...</p>}
        {!isLoading && blogs.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">
            No blogs found yet. Start creating your first story!
          </p>
        )}
        {blogs.map((blog: any) => (
          <Card
            key={blog.id}
            className="relative bg-gray-800 hover:scale-105 transform transition-all duration-300 shadow-lg overflow-hidden group"
          >
            <img
              src={blog.featuredImageUrl || "https://i.pinimg.com/564x/placeholder.jpg"}
              alt={blog.title}
              className="rounded-t-xl h-40 w-full object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-xl font-bold text-pink-400">{blog.title}</h3>
              <p className="text-gray-300 line-clamp-3 mt-2">{blog.content}</p>
            </CardContent>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <Link to={`/dashboard/edit/${blog.id}`}>
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  Read More
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 py-6">
        &copy; {new Date().getFullYear()} Your Blog Platform. Follow me on{" "}
        <a
          href="https://github.com/de-scientist"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500 transition"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}
