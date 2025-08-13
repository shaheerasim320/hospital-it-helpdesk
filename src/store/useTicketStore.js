import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFilesToCloudinary } from "@/utils/uploadFilesToCloudinary";

const useTicketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  error: null,
  recentTickets: [],
  assignedTickets: [],
  openTickets: [],
  myTickets: [],
  ticketStats: { open: 0, inProgress: 0, resolved: 0 },

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await getDocs(collection(db, "tickets"));
      const ticketsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ tickets: ticketsData, loading: false });
    } catch (err) {
      console.error("Error fetching tickets:", err);
      set({ error: "Failed to fetch tickets", loading: false });
    }
  },

  createTicket: async (ticketData, attachments) => {
    try {
      const generateReadableTicketId = async () => {
        const snapshot = await getDocs(collection(db, "tickets"));
        const count = snapshot.size + 1;
        const year = new Date().getFullYear();
        return `TCK-${year}-${String(count).padStart(4, "0")}`;
      };

      const readableTicketId = await generateReadableTicketId();

      const newTicket = {
        ...ticketData,
        ticketId: readableTicketId,
        status: "open",
        attachments: [],
        assignedTo: null,
        dateSubmitted: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        comments: [
          {
            id: 1,
            author: "System",
            authorRole: "system",
            content: "Ticket created and added to the queue.",
            timestamp: new Date().toISOString(),
            type: "system",
          },
        ],
      };

      const docRef = await addDoc(collection(db, "tickets"), newTicket);

      let attachmentURLs = [];
      if (attachments && attachments.length > 0) {
        attachmentURLs = await uploadFilesToCloudinary(attachments);
        await updateDoc(doc(db, "tickets", docRef.id), {
          attachments: attachmentURLs,
          lastUpdated: new Date().toISOString(),
        });
      }

      set((state) => ({
        tickets: [
          { id: docRef.id, ...newTicket, attachments: attachmentURLs },
          ...state.tickets,
        ],
      }));

      await fetch("/api/tickets/send-ticket-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: ticketData.submittedByEmail,
          name: ticketData.submittedBy,
          title: ticketData.title,
          ticketId: readableTicketId,
        }),
      });

      await get().fetchRecentTickets(ticketData.submittedByEmail);

    } catch (err) {
      console.error("Error creating ticket:", err);
    }
  },



  updateTicketStatus: async (ticketId, status) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, {
        status,
        lastUpdated: new Date().toISOString()
      });

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId ? { ...t, status, lastUpdated: new Date().toISOString().split("T")[0] } : t
        ),
      }));
    } catch (err) {
      console.error("Error updating ticket status:", err);
    }
  },

  assignTicket: async (ticketId, assigneeUid) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, {
        assignedTo: assigneeUid,
        lastUpdated: new Date().toISOString()
      });

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId ? { ...t, assignedTo: assigneeUid, lastUpdated: new Date().toISOString().split("T")[0] } : t
        ),
      }));
    } catch (err) {
      console.error("Error assigning ticket:", err);
    }
  },

  addComment: async (ticketId, comment) => {
    try {
      await get().fetchTickets();
      const state = get();
      const ticketRef = doc(db, "tickets", ticketId);
      const targetTicket = state.tickets.find((t) => t.id === ticketId);
      const updatedComments = [
        ...(targetTicket.comments || []),
        {
          id: Date.now(),
          ...comment,
          timestamp: new Date().toISOString(),
        },
      ];

      await updateDoc(ticketRef, {
        comments: updatedComments,
        lastUpdated: new Date().toISOString()
      });

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId ? { ...t, comments: updatedComments, lastUpdated: new Date().toISOString().split("T")[0] } : t
        ),
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  },
  fetchRecentTickets: async (email) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, "tickets"),
        where("submittedByEmail", "==", email),
        orderBy("dateSubmitted", "desc"),
        limit(3)
      );

      const snapshot = await getDocs(q);
      const ticketsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          submittedOn: data.dateSubmitted,
          status: data.status
        };
      });
      set({ recentTickets: ticketsData, loading: false });
    } catch (err) {
      console.error("Error fetching recent tickets:", err);
      set({ error: "Failed to fetch recent tickets", loading: false });
    }
  },
  subscribeAssignedTickets: async (id) => {
    if (get().assignedTicketsUnsubscribe) {
      get().assignedTicketsUnsubscribe();
    }
    const q = query(collection(db, "tickets"), where("assignedTo", "==", id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ assignedTickets: tickets });
    }, (error) => {
      console.error("Error fetching assigned tickets:", error);
      set({ error: "Failed to load tickets" });
    });
    set({ assignedTicketsUnsubscribe: unsubscribe });
  },
  unsubscribeAssignedTickets: () => {
    if (get().assignedTicketsUnsubscribe) {
      get().assignedTicketsUnsubscribe();
      set({ assignedTicketsUnsubscribe: null })
    }
  },
  subscribeOpenTickets: () => {
    if (get().openTicketsUnsubscribe) {
      get().openTicketsUnsubscribe();
    }

    const q = query(
      collection(db, "tickets"),
      where("status", "==", "open"),
      where("assignedTo", "==", null)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ openTickets: tickets });
    }, (error) => {
      console.error("Error fetching open tickets:", error);
      set({ error: "Failed to load open tickets" });
    });

    set({ openTicketsUnsubscribe: unsubscribe });
  },

  unsubscribeOpenTickets: () => {
    if (get().openTicketsUnsubscribe) {
      get().openTicketsUnsubscribe();
      set({ openTicketsUnsubscribe: null });
    }
  },


  subscribeMyTickets: (email) => {
    if (get().myTicketsUnsubscribe) {
      get().myTicketsUnsubscribe();
    }

    const ticketsCol = collection(db, "tickets");
    const q = query(
      ticketsCol,
      where("submittedByEmail", "==", email),
      orderBy("dateSubmitted", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ myTickets: tickets });
    }, (error) => {
      console.error("Error fetching my tickets:", error);
      set({ error: "Failed to load my tickets" });
    });

    set({ myTicketsUnsubscribe: unsubscribe });
  },

  unsubscribeMyTickets: () => {
    if (get().myTicketsUnsubscribe) {
      get().myTicketsUnsubscribe();
      set({ myTicketsUnsubscribe: null });
    }
  },

  subscribeTicketStats: () => {
    if (get().ticketStatsUnsubscribe) {
      get().ticketStatsUnsubscribe();
    }

    const ticketsCol = collection(db, "tickets");

    const unsubscribe = onSnapshot(ticketsCol, (snapshot) => {
      const allTickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const stats = {
        open: allTickets.filter(t => t.status === "open").length,
        inProgress: allTickets.filter(t => t.status === "in-progress").length,
        resolved: allTickets.filter(t => {
          const updatedDate = t.lastUpdated instanceof Date
            ? t.lastUpdated
            : new Date(t.lastUpdated);

          return (
            t.status === "resolved" &&
            updatedDate >= todayStart &&
            updatedDate <= todayEnd
          );
        }).length
      };

      set({ ticketStats: stats });
    }, (error) => {
      console.error("Error fetching ticket stats:", error);
      set({ error: "Failed to load ticket stats" });
    });

    set({ ticketStatsUnsubscribe: unsubscribe });
  },

  unsubscribeTicketStats: () => {
    if (get().ticketStatsUnsubscribe) {
      get().ticketStatsUnsubscribe();
      set({ ticketStatsUnsubscribe: null });
    }
  },


}));

export default useTicketStore;
