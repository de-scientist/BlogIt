import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // Added useRef for animation
// 💡 Added icons for the new features section
import { ChevronLeft, ChevronRight, Zap, Globe, PenTool, TrendingUp, DollarSign, Users, BookOpen, Clock } from "lucide-react"; 

// --- Interactive Fact Data ---
const facts = [
  "Blogging is a time commitment. Successful bloggers often spend more time promoting than writing!",
  "The earliest blogs were simply hand-coded Web Logs (hence, blog).",
  "Many popular blogging platforms allow you to monetize your content using AdSense or affiliate links.",
  "Using a clean, responsive template is crucial for retaining readers across all devices.",
  "Google Analytics is a key tool for discovering where your readers come from and what content they love.",
];
const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

// --- Enhanced Slides Data (Incorporating Blogging Insights) ---
const slides = [
  {
    image: "/images/slide1.jpeg", // Placeholder image path
    title: "Share Your Story",
    subtitle:
      "Every voice deserves a platform. Start your creative journey today.",
  },
  {
    image: "/images/slide2.jpeg", // Placeholder image path
    title: "Inspire Others",
    subtitle: "Write, share, and impact lives with your ideas and experiences.",
  },
  // New Slide: Monetization Insight
  {
    image: "/images/slide4.jpeg", // Placeholder image path
    title: "Turn Your Passion into Profit",
    subtitle: "Integrate ads, affiliate links, and monetization tools easily.",
  },
  // New Slide: Customization Insight
  {
    image: "/images/slide5.jpeg", // Placeholder image path
    title: "Make It Uniquely Yours",
    subtitle: "Full control over design, colors, and fonts—no coding required.",
  },
  // Original slide 3, moved down
  {
    image: "/images/slide3.jpeg", // Placeholder image path
    title: "Join a Community",
    subtitle: "Connect with writers and thinkers from around the world.",
  },
];

// 💡 Data for the new Feature/Value Prop Section
const keyFeatures = [
    {
        icon: PenTool,
        title: "Intuitive Editor",
        description: "Focus on writing, not formatting. Supports rich text and Markdown.",
        color: "text-purple-600",
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Publish instantly to connect with an audience across the world.",
        color: "text-indigo-600",
    },
    {
        icon: TrendingUp,
        title: "Audience Growth",
        description: "Built-in SEO tools and analytics to help your stories go viral.",
        color: "text-green-600",
    },
    {
        icon: DollarSign,
        title: "Monetize Content",
        description: "Tools to easily earn income from your posts through ads or subscriptions.",
        color: "text-pink-600",
    },
];

// 💡 Data for the Stats Section (Updated for animation)
const platformStats = [
  {
    icon: Users,
    target: 150000,
    label: "Active Users",
    formatted: "150K+",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: BookOpen,
    target: 2500000,
    label: "Posts Published",
    formatted: "2.5M+",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Clock,
    target: 10, // Target is the base number of years
    label: "Serving Creators",
    formatted: "10 Years", // The final displayed string
    color: "from-green-500 to-teal-600",
  },
];

// 💡 NEW COMPONENT: Animated Stat Counter
interface AnimatedStatProps {
    target: number;
    duration?: number;
    formatter: (value: number) => string;
}

const AnimatedStat = ({ target, duration = 2000, formatter }: AnimatedStatProps) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef<number>();
    const startTimeRef = useRef<number>();

    useEffect(() => {
        startTimeRef.current = performance.now();
        const step = (timestamp: number) => {
            if (!startTimeRef.current) return;
            const progress = timestamp - startTimeRef.current;
            
            // Calculate current value based on progress (ease-out effect)
            let currentValue = 0;
            if (progress < duration) {
                const ratio = progress / duration;
                // Using a cubic ease-out function for smoother transition
                const easedRatio = 1 - Math.pow(1 - ratio, 3); 
                currentValue = Math.floor(easedRatio * target);
                setCount(currentValue);
                frameRef.current = requestAnimationFrame(step);
            } else {
                // Ensure the final value is exactly the target
                setCount(target);
                cancelAnimationFrame(frameRef.current!);
            }
        };

        frameRef.current = requestAnimationFrame(step);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [target, duration]);

    return <p className="text-5xl font-extrabold text-white drop-shadow-md">{formatter(count)}</p>;
};


export default function Home() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentFact, setCurrentFact] = useState(getRandomFact()); // State for interactive fact

  // Auto-slide functionality
  useEffect(() => {
    // The interval automatically handles the new slide length
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 
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
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16"> 
      {/* pt-16 accounts for the space occupied by the top navbar */}

      {/* ---------------------------------- */}
      {/* SECTION 1: HERO / INTRO */}
      {/* ---------------------------------- */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6 text-center space-y-8">
        {/* Enhanced Hero Title with Gradient */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-lg">
          Publish Your Thoughts. Build Your Legacy.
        </h1>

        {/* Clearer Message */}
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed">
          Unlock your potential as a creator. This is where you connect with a global audience, share your unique perspective, and turn your written word into something impactful. **Start your free blog today.**
        </p>

        {/* Action Buttons (Improved Styling) */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
          <Button
            type="button"
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all text-white font-bold rounded-full px-12 py-7 text-lg shadow-2xl shadow-purple-500/50 transform hover:scale-[1.03]"
            onClick={() => navigate(user ? "/dashboard" : "/auth/login")}
          >
            {user ? "Go to Dashboard" : "Start Blogging Now"}
          </Button>

          {/* CTA: View Inspiration */}
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="border-2 border-indigo-400 bg-gradient-to-r from-green-500 to-teal-400 text-white transition-all font-semibold rounded-full px-12 py-7 text-lg dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
            onClick={() => navigate("/inspiration")}
          >
            View Inspiration
          </Button>
        </div>
      </section>
      
      {/* ---------------------------------- */}
      {/* SECTION 2: KEY FEATURES / VALUE PROPOSITION */}
      {/* ---------------------------------- */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 dark:text-gray-200">
            Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature, index) => (
                <div 
                    key={index} 
                    className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-purple-500"
                >
                    <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* ---------------------------------- */}
      {/* SECTION 3: PLATFORM STATS (NOW ANIMATED) */}
      {/* ---------------------------------- */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-800 dark:text-gray-200">
            Our Impact: By The Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platformStats.map((stat, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 text-center bg-gradient-to-br ${stat.color} transition-all duration-500 transform hover:scale-[1.02]`}
            >
              <stat.icon className="w-10 h-10 mx-auto mb-3 text-white/90" />
              {/* 💡 Replaced static <p> tag with the new AnimatedStat component */}
              <AnimatedStat 
                target={stat.target}
                formatter={(value) => stat.formatted.replace(/\d+/g, value.toLocaleString())}
              />
              <p className="text-lg font-medium text-white/80 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------- */}
      {/* SECTION 4: Interactive Fact (Original Section 3, moved down) */}
      {/* ---------------------------------- */}
      <section className="w-full max-w-6xl mx-auto px-6 mt-10">
          <div 
            className="p-5 md:p-8 bg-gradient-to-r from-yellow-50 to-orange-100 dark:from-slate-700 dark:to-slate-800 rounded-xl shadow-inner border border-yellow-200 dark:border-slate-600 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setCurrentFact(getRandomFact())} // Click to change fact
            title="Click to discover another blogging insight!"
          >
            <p className="flex items-center justify-center text-lg font-medium text-orange-800 dark:text-orange-300">
              <Zap className="w-6 h-6 mr-3 text-orange-600 animate-pulse" />
              **Blogging Fact:** {currentFact}
            </p>
          </div>
      </section>

      {/* ---------------------------------- */}
      {/* SECTION 5: SLIDES / HERO CAROUSEL (Original Section 4, moved down) */}
      {/* ---------------------------------- */}
      <div className="relative w-full max-w-6xl mx-auto h-[60vh] max-h-[600px] mt-12 mb-20 px-6">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 rounded-3xl overflow-hidden shadow-2xl ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}: ${slide.title}`}
              className="w-full h-full object-cover rounded-3xl"
            />
            {/* Overlay for better readability and style */}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl animate-fadeIn">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mt-4 animate-fadeIn delay-200 max-w-2xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* ARROWS (Styled for higher contrast and professionalism) */}
        <button
          type="button"
          title="Previous Slide"
          onClick={handlePrev}
          className="absolute left-10 top-1/2 -translate-y-1/2 p-4 bg-white/50 hover:bg-white/90 backdrop-blur-sm shadow-2xl rounded-full transition z-20"
        >
          <ChevronLeft size={32} className="text-gray-800" />
        </button>

        <button
          type="button"
          title="Next Slide"
          onClick={handleNext}
          className="absolute right-10 top-1/2 -translate-y-1/2 p-4 bg-white/50 hover:bg-white/90 backdrop-blur-sm shadow-2xl rounded-full transition z-20"
        >
          <ChevronRight size={32} className="text-gray-800" />
        </button>

        {/* INDICATORS (Styled with gradient for current slide) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              title={`Go to Slide ${index + 1}`}
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                index === currentSlide
                  ? "bg-gradient-to-r from-purple-500 to-pink-400 scale-150 shadow-md"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ANIMATIONS (Kept as is) */}
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