import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const useTicketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

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

      const initialTicket = {
        ...ticketData,
        ticketId: readableTicketId,
        status: "open",
        attachments: [],
        assignedTo: null,
        dateSubmitted: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
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

      const docRef = await addDoc(collection(db, "tickets"), initialTicket);

      let attachmentURLs = [];
      if (attachments.length > 0) {
        attachmentURLs = await uploadFilesToStorage(attachments, docRef.id);
      }

      await updateDoc(doc(db, "tickets", docRef.id), {
        id: docRef.id,
        attachments: attachmentURLs,
      });

      set((state) => ({
        tickets: [
          {
            id: docRef.id,
            ...initialTicket,
            attachments: attachmentURLs,
            createdAt: new Date(),
          },
          ...state.tickets,
        ],
      }));

      await fetch("/api/send-ticket-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: ticketData.submittedByEmail,
          name: ticketData.submittedBy,
          title: ticketData.title,
          ticketId: readableTicketId,
        }),
      });
    } catch (err) {
      console.error("Error creating ticket:", err);
    }
  },



  updateTicketStatus: async (ticketId, status) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, {
        status,
        updatedAt: serverTimestamp(),
        lastUpdated: new Date().toISOString().split("T")[0],
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
        updatedAt: serverTimestamp(),
        lastUpdated: new Date().toISOString().split("T")[0],
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
      console.log(targetTicket)
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
        updatedAt: serverTimestamp(),
        lastUpdated: new Date().toISOString().split("T")[0],
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
}));

export default useTicketStore;
