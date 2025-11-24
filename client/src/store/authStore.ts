import { create } from "zustand";
import { api } from "@/lib/axios";


interface AuthState {
user: any | null;
loading: boolean;
setUser: (u: any) => void;
login: (identifier: string, password: string) => Promise<void>;
register: (data: any) => Promise<void>;
logout: () => Promise<void>;
}


export const useAuth = create<AuthState>((set) => ({
user: null,
loading: false,


setUser: (user) => set({ user }),


login: async (identifier, password) => {
set({ loading: true });
const res = await api.post("/auth/login", { identifier, password });
set({ user: res.data, loading: false });
},


register: async (data) => {
set({ loading: true });
await api.post("/auth/register", data);
set({ loading: false });
},


logout: async () => {
await api.post("/auth/logout");
set({ user: null });
},
}));