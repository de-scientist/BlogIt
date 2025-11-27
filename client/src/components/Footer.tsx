import { Separator } from "@/components/ui/separator";
import { Github, Mail, Globe, Heart } from "lucide-react"; // 💡 Added Heart for professional touch

export default function BlogFooter() {
    // ⚠️ NOTE ON TOAST: If toasts were needed here, the configuration (e.g., <Toaster position="bottom-left" />) 
    // would typically be placed in the main App or Root layout, but the positioning is enforced as requested.

  return (
    // 💡 APPLIED: pl-4 for sidebar offset. Dark mode enabled with background color change.
    <footer className="w-full bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-16 pl-4">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* 1. Brand & Mission (Professional Heading) */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400">
              TechVision S&S
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-400 mt-3 leading-relaxed">
              Writing, building, and shaping the future — one idea, one
              creation, one innovation at a time.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-l-2 border-purple-500 pl-2">
                Navigation
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-base">
              <li>
                <a href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Be Inspired
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Talk to Us
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Connect/Socials */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-l-2 border-purple-500 pl-2">
                Connect With Us
            </h3>
            <ul className="space-y-3 text-base text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-3">
                {/* 💡 Fix for deprecated Github icon by using standard import/usage */}
                <Github className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <a
                  href="https://github.com/de-scientist"
                  target="_blank"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  rel="noopener noreferrer"
                >
                  GitHub / de-scientist
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <a
                  href="mailto:gitaumark502@gmail.com"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  Email / gitaumark502@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <a
                  href="https://1descientist.vercel.app/"
                  target="_blank"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  rel="noopener noreferrer"
                >
                  Portfolio / Check out my works
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-gray-300 dark:bg-slate-700" />

        {/* Bottom Section (Copyright) */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-500">
          © {new Date().getFullYear()} TechVision Studios & Solutions. All rights reserved.
          <span className="flex items-center justify-center mt-1">
                Crafted with <Heart className="h-4 w-4 mx-1 text-red-500" fill="currentColor" /> and intention.
            </span>
        </div>
      </div>
    </footer>
  );
}