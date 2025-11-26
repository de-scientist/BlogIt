import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./layout/Sidebar";
import BlogFooter from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Section: Sidebar + Page Content */}
      <div className="flex flex-1 w-full">

        {/* Sidebar (already handles mobile/desktop internally) */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <BlogFooter />
    </div>
  );
}
