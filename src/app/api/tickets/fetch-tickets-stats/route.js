import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const ticketsCol = collection(db, "tickets");

    const openSnap = await getDocs(query(ticketsCol, where("status", "==", "open")));
    const inProgressSnap = await getDocs(query(ticketsCol, where("status", "==", "in-progress")));

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const resolvedTodaySnap = await getDocs(
      query(
        ticketsCol,
        where("status", "==", "resolved"),
        where("lastUpdated", ">=", todayStart),
        where("lastUpdated", "<=", todayEnd)
      )
    );

    const stats = {
      open: openSnap.size,
      inProgress: inProgressSnap.size,
      resolved: resolvedTodaySnap.size,
    };

    return new Response(JSON.stringify(stats), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch ticket stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), { status: 500 });
  }
}
