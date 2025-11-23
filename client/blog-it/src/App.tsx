import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/reactQuery";
import Layout from "../components/Layout";
import { useEffect } from "react";
import api from "../lib/axios";
import { useAuthStore } from "../hooks/useAuthStore";


export default function App({ Component, pageProps }: AppProps) {
const setUser = useAuthStore((s) => s.setUser);


useEffect(() => {
// try fetch current user on app load
api
.get("/auth/me")
.then((res) => setUser(res.data))
.catch(() => setUser(null));
}, [setUser]);


return (
<QueryClientProvider client={queryClient}>
<Layout>
<Component {...pageProps} />
</Layout>
</QueryClientProvider>
);
}