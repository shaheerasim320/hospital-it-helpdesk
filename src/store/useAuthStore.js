import { create } from "zustand";
import { getAuth, signOut } from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false, error: null }),

  logout: async () => {
    try {
      set({ loading: true, error: null });

      const auth = getAuth();
      await signOut(auth);

      await fetch("/api/auth/logout", { method: "POST" });

      set({ user: null, loading: false, error: null });
    } catch (error) {
      console.error("Logout failed:", error);
      set({ loading: false, error: "Failed to log out" });
    }
  },

  fetchUser: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      set({ user: data.user, loading: false, error: null });
      return data.user;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      set({ user: null, loading: false, error: null });
      return null;
    }
  },
}));

export default useAuthStore;
