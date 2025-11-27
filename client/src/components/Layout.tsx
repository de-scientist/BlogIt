import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner"; // 💡 IMPORT: Import the Toaster component
import Navbar from "./Navbar";
import Sidebar from "./layout/Sidebar";
import BlogFooter from "./Footer";


export default function Layout() { 
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Section: Sidebar + Page Content */}
      <div className="flex flex-1 w-full">

        <Sidebar />

        {/* Page Content */}
          <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="max-w-5xl mx-auto">
            {/* Renders the current route component */}
            <Outlet /> 
          </div>
        </main>
      </div>

      {/* Footer */}
      <BlogFooter />

      {/* 💡 TOASTER: Render the Toaster component here */}
      {/* It will listen for all calls to toast.success/error etc. */}
      <Toaster 
        position="bottom-left" // Sets the required toast position
        richColors          // Use rich colors for success/error states
        // Other props like closeButton can be added here
      />
    </div>
  );
}