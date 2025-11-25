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
  const [offsetY, setOffsetY] = useState(0);

  // Slide auto-advance
  useEffect(() => {
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  // Scroll listener for parallax
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900 md:pl-64">

      {/* FULL-VIEW HERO WITH PARALLAX */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ transform: `translateY(${offsetY * 0.2}px)` }}
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl animate-fadeIn">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mt-3 animate-fadeIn delay-200 max-w-3xl">
                {slide.subtitle}
              </p>
              <Button
                type="button"
                size="lg"
                className="mt-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all text-white font-semibold rounded-xl px-10 py-4 shadow-xl animate-fadeIn delay-400"
                onClick={() => navigate(user ? "/dashboard" : "/auth/login")}
              >
                {user ? "Go to Dashboard" : "Create a Blog"}
              </Button>
            </div>
          </div>
        ))}

        {/* SLIDE CONTROLS */}
        <button
          type="button"
          title="Previous Slide"
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/70 hover:bg-white shadow-xl rounded-full transition"
        >
          <ChevronLeft size={28} className="text-gray-800" />
        </button>

        <button
          type="button"
          title="Next Slide"
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/70 hover:bg-white shadow-xl rounded-full transition"
        >
          <ChevronRight size={28} className="text-gray-800" />
        </button>

        {/* INDICATORS */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 scale-125"
                  : "bg-white/70"
              }`}
              title="Go to Slide"
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-gray-50 text-gray-600 border-t">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Your Blog Platform. All rights reserved.
        </p>

        <div className="flex justify-center mt-2">
          <a
            href="https://github.com/your-github-username"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Github size={18} /> GitHub
          </a>
        </div>
      </footer>

      {/* ANIMATIONS */}
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
          .delay-400 {
            animation-delay: 0.4s;
          }
        `}
      </style>
    </main>
  );
}
