import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <Sidebar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
