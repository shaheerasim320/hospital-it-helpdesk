import { create } from "zustand";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const useAdminStore = create((set, get) => ({
  staff: [],
  loading: false,

  fetchStaff: async () => {
    set({ loading: true });
    const snapshot = await getDocs(collection(db, "users"));
    const staffData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    set({ staff: staffData, loading: false });
  },

  approveStaff: async (uid) => {
    await updateDoc(doc(db, "users", uid), { status: "approved" });
    await get().fetchStaff();
  },

  revokeStaff: async (uid) => {
    await updateDoc(doc(db, "users", uid), { status: "pending" });
    await get().fetchStaff();
  },
  
  updateRole: async (uid, newRole) => {
    await updateDoc(doc(db, "users", uid), { role: newRole });
    await get().fetchStaff();
  },
}));

export default useAdminStore;
