import create from "zustand";


type User = {
id: string;
firstName: string;
lastName: string;
emailAddress: string;
userName: string;
};


type AuthState = {
user: User | null;
setUser: (u: User | null) => void;
logoutClient: () => void;
};


export const useAuthStore = create<AuthState>((set) => ({
user: null,
setUser: (u) => set({ user: u }),
logoutClient: () => set({ user: null }),
}));