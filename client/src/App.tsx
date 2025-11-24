import "./styles/globals.css";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/react-query";
import api from "./lib/axios";
import { useAuth } from "./store/authStore";
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const setUser = useAuth((s) => s.setUser);

  useEffect(() => {
    // try to fetch current user on app load
    api
      .get("/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
