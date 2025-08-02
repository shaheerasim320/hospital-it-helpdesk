import { create } from "zustand";

const useAdminStore = create((set) => ({
    users: [],
    loading: false,
    error: null,
    fetchUsers: async () => {
        
    }
}))