import React from "react";
import { Outlet } from "react-router-dom"; // 💡 New Import
import Navbar from "./Navbar"; 
import BlogFooter from "./Footer"; 

// ❌ Removed { children }: { children: React.ReactNode } from the props
export default function NoSidebarLayout() { 
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content (Full Width) */}
      <main className="flex-1 px-6 py-8 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {/* ✅ Replaced {children} with <Outlet /> */}
          <Outlet /> 
        </div>
      </main>

      {/* Footer */}
      <BlogFooter />
    </div>
  );
}