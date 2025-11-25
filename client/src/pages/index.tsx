import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Github } from "lucide-react";

const slides = [
  {
    image: "/images/slide1.jpeg",
    title: "Share Your Story",
    subtitle: "Every story deserves to be heard. Start your creative journey today.",
  },
  {
    image: "/images/slide2.jpeg",
    title: "Inspire Others",
    subtitle: "Write, share, and impact lives with your ideas and experiences.",
  },
  {
    image: "/images/slide3.jpeg",
    title: "Join a Community",
    subtitle: "Connect with writers and thinkers from around the world.",
  },
];

export default function Home() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <main className="min-h-screen flex flex-col justify-between bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto p-6 gap-10 mt-12">
        {/* Text Section */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            Your Stories. Your Voice.
          </h1>
          <p className="text-lg text-gray-300 max-w-lg drop-shadow-sm">
            Welcome to a professional blogging platform designed for creators who want their work to shine.
            Share, connect, and inspire your audience with every post you create.
          </p>
          <p className="text-gray-400 max-w-lg">
            Join today and start your first blog post by clicking the button below.
          </p>
          <Button
            type="button"
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => navigate("/auth/register")}
          >
            Create a Blog
          </Button>
        </div>

        {/* Carousel Section */}
        <div className="flex-1 relative w-full md:h-96 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover brightness-90 transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4 space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold animate-fadeIn drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl animate-fadeIn delay-200 drop-shadow-sm">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button
            type="button"
            title="Previous Slide"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800/60 text-white rounded-full hover:bg-gray-800/80 transition shadow"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            title="Next Slide"
            onClick={handleNext}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800/60 text-white rounded-full hover:bg-gray-800/80 transition shadow"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                title={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? "bg-indigo-500" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Optional Secondary Text */}
      <div className="mt-12 max-w-4xl mx-auto text-center text-gray-400 space-y-4 px-4">
        <p>
          Discover, create, and share stories with creators worldwide. Focus on your content without distractions.
        </p>
        <p>
          Whether you're a beginner or an experienced writer, our platform helps you reach your audience effectively.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 bg-gray-950 text-gray-400 text-center flex flex-col items-center gap-2 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Your Blog Platform. All rights reserved.</p>
        <a
          href="https://github.com/your-github-username"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-white transition"
        >
          <Github size={18} /> GitHub
        </a>
      </footer>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }
        `}
      </style>
    </main>
  );
}
