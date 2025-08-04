import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      setUser: (userData) => set({ user: userData, error: null }),
      logout: () => set({ user: null }),
      setLoading: (isLoading) => set({ loading: isLoading }),
      setError: (error) => set({ error }),
    }),
    { name: "auth-store" }
  )
);

export default useAuthStore;
