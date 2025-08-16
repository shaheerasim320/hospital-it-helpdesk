import { create } from "zustand";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  query,
  updateDoc,
  onSnapshot,
  where,
  orderBy
} from "firebase/firestore";

const useSystemStatusStore = create((set, get) => ({
  systems: [],
  activeSystems: [],
  recentAlerts: [],
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    serverLoad: 67,
    memoryUsage: 82,
    diskUsage: 78,
    networkTraffic: "2.4 GB/s"
  },
  loading: false,
  error: null,

  resetStore: () => {
    const {
      systemStatusesUnsubscribe,
      activeSystemsUnsubscribe,
      statsUnsubscribe,
      alertsUnsubscribe
    } = get();
    if (systemStatusesUnsubscribe) systemStatusesUnsubscribe();
    if (activeSystemsUnsubscribe) activeSystemsUnsubscribe(); 
    if (statsUnsubscribe) statsUnsubscribe();
    if (alertsUnsubscribe) alertsUnsubscribe();
    set({
      systems: [],
      activeSystems: [],
      recentAlerts: [],
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        serverLoad: 67,
        memoryUsage: 82,
        diskUsage: 78,
        networkTraffic: "2.4 GB/s"
      },
      loading: false,
      error: null,
      systemStatusesUnsubscribe: null,
      activeSystemsUnsubscribe: null,
      statsUnsubscribe: null,
      alertsUnsubscribe: null
    });
  },

  subscribeSystemStatuses: () => {
    if (get().systemStatusesUnsubscribe) {
      get().systemStatusesUnsubscribe();
    }

    set({ loading: true, error: null });

    const statusesCol = collection(db, "systemStatuses");

    const unsubscribe = onSnapshot(
      statusesCol,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        set({ systems: data, loading: false });
      },
      (error) => {
        console.error("Error fetching system statuses:", error);
        set({ error: "Failed to load system statuses", loading: false });
      }
    );

    set({ systemStatusesUnsubscribe: unsubscribe });
  },

  subscribeActiveSystems: () => {
    if (get().activeSystemsUnsubscribe) {
      get().activeSystemsUnsubscribe();
    }

    const q = query(
      collection(db, "systemStatuses"),
      where("status", "==", "operational")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const active = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        set({ activeSystems: active });
      },
      (error) => {
        console.error("Error fetching active systems:", error);
        set({ error: "Failed to load active systems" });
      }
    );

    set({ activeSystemsUnsubscribe: unsubscribe });
  },

  subscribeStats: () => {
    if (get().statsUnsubscribe) {
      get().statsUnsubscribe();
    }

    const usersCol = collection(db, "users");

    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const allUsers = snapshot.docs.map(doc => doc.data());
        const totalUsers = allUsers.length;
        const activeUsers = allUsers.filter(u => u.status === "approved").length;

        set({
          stats: {
            totalUsers,
            activeUsers,
            serverLoad: 67,
            memoryUsage: 82,
            diskUsage: 78,
            networkTraffic: "2.4 GB/s"
          }
        });
      },
      (error) => {
        console.error("Error fetching stats:", error);
        set({ error: "Failed to load stats" });
      }
    );

    set({ statsUnsubscribe: unsubscribe });
  },

  subscribeRecentAlerts: () => {
    if (get().alertsUnsubscribe) {
      get().alertsUnsubscribe();
    }

    set({ loading: true, error: null });

    const alertsQuery = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const alerts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp).toLocaleString(), // readable format
        }));
        set({ recentAlerts: alerts, loading: false });
      },
      (error) => {
        console.error("Error fetching alerts:", error);
        set({ error: "Failed to load alerts", loading: false });
      }
    );

    set({ alertsUnsubscribe: unsubscribe });
  },

  updateSystemStatus: async (systemId, newStatus) => {
    try {
      const systemRef = doc(db, "systemStatuses", systemId);
      await updateDoc(systemRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      });

      console.log(`System ${systemId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating system status:", error);
      set({ error: "Failed to update system status" });
    }
  },

  unsubscribeSystemStatuses: () => {
    if (get().systemStatusesUnsubscribe) {
      get().systemStatusesUnsubscribe();
      set({ systemStatusesUnsubscribe: null });
    }
  },
  unsubscribeActiveSystems: () => {
    if (get().activeSystemsUnsubscribe) {
      get().activeSystemsUnsubscribe();
      set({ activeSystemsUnsubscribe: null });
    }
  },
  unsubscribeStats: () => {
    if (get().statsUnsubscribe) {
      get().statsUnsubscribe();
      set({ statsUnsubscribe: null });
    }
  },
  unsubscribeRecentAlerts: () => {
    if (get().alertsUnsubscribe) {
      get().alertsUnsubscribe();
      set({ alertsUnsubscribe: null });
    }
  },
}));

export default useSystemStatusStore;
