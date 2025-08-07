import { create } from 'zustand';
import { getAuth, signOut } from 'firebase/auth';

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (userData) => set({ user: userData, error: null }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),

  logout: async () => {
    try {
      set({ loading: true });

      const auth = getAuth();
      await signOut(auth);

      await fetch('/api/logout', { method: 'POST' });

      set({ user: null, loading: false, error: null });
    } catch (error) {
      console.error('Logout failed:', error);
      set({ loading: false, error: 'Failed to log out' });
    }
  },
}));

export default useUserStore;
