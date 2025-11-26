import { Separator } from "@/components/ui/separator";
import { Github, Mail, Globe } from "lucide-react";

export default function BlogFooter() {
  return (
    <footer className="w-full bg-white border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              TechVision S & S
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Writing, building, and shaping the future — one idea, one
              creation, one innovation at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                <a href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-gray-900 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="hover:text-gray-900 transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-gray-900 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                <a
                  href="https://github.com/De-Scientist"
                  target="_blank"
                  className="hover:text-gray-900 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <a
                  href="mailto:gitaumark502@gmail.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  Email
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <a
                  href="https://techvisionstudios.co"
                  target="_blank"
                  className="hover:text-gray-900 transition-colors"
                >
                  Portfolio Site
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Bottom Section */}
        <div className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} TechVision Studios & Solutions — Crafted
          with intention. Built with excellence.
        </div>
      </div>
    </footer>
  );
}
