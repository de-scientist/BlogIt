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
    <main className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-900 md:pl-64">

      {/* HERO / INTRO SECTION */}
      <section className="w-full max-w-5xl mx-auto py-20 px-6 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-lg">
          Your Stories. Your Voice.
        </h1>

        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          Welcome to a platform designed for creators — clean, modern, distraction-free.
          Focus on your ideas. Let the world hear your voice.
        </p>

        <Button
          type="button"
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all text-white font-semibold rounded-xl px-10 py-3 shadow-xl"
          onClick={() => navigate(user ? "/dashboard" : "/auth/login")}
        >
          {user ? "Go to Dashboard" : "Create a Blog"}
        </Button>
      </section>

      {/* SLIDES / HERO CAROUSEL */}
      <div className="relative w-full h-[60vh] max-h-[600px] mt-10 px-6">

        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 rounded-xl overflow-hidden ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl animate-fadeIn">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mt-3 animate-fadeIn delay-200 max-w-2xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* ARROWS */}
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              title="Go to Slide"
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 scale-125"
                  : "bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-8 bg-gray-50 text-gray-600 border-t mt-16">
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
        `}
      </style>

    </main>
  );
}
