import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/slide1.jpg",
    title: "Share Your Story",
    subtitle: "Every story deserves to be heard. Start your creative journey today.",
  },
  {
    image: "/images/slide2.jpg",
    title: "Inspire Others",
    subtitle: "Write, share, and impact lives with your ideas and experiences.",
  },
  {
    image: "/images/slide3.jpg",
    title: "Join a Community",
    subtitle: "Connect with writers and thinkers from around the world.",
  },
];

export default function Home() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-900">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Your Stories. Your Voice.
          </h1>
          <p className="text-lg text-gray-700">
            Welcome to our blogging platform, a clean and modern space designed for creators, writers, and thinkers.
            Share your ideas, explore others’ stories, and become part of a growing creative community.
          </p>
          <p className="text-gray-600">
            Ready to start your journey? Click below to create your first blog post.
          </p>
          <Button
            type="button"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white animate-pulse-slow"
            onClick={() => navigate("/auth/register")}
          >
            Create a Blog
          </Button>
        </div>

        {/* Carousel Section */}
        <div className="flex-1 relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center text-white px-4 space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold animate-fadeIn">{slide.title}</h2>
                <p className="text-lg md:text-xl animate-fadeIn delay-200">{slide.subtitle}</p>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button
            type="button"
            title="Previous Slide"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-800/70 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            title="Next Slide"
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-800/70 transition"
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
                  index === currentSlide ? "bg-blue-600" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Optional Secondary Text */}
      <div className="mt-12 max-w-4xl text-center text-gray-600 space-y-4">
        <p>
          Discover stories from creators worldwide, follow authors you love, and build your own audience. 
          Your journey starts here — one story at a time.
        </p>
        <p>
          Our platform provides a simple, distraction-free experience that focuses on what matters most: your content.
        </p>
      </div>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
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
