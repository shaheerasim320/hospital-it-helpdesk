import MyTicketsContent from "@/components/MyTicketsContent";
import ProtectedRoute from "@/components/ProtectedRoute";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyTickets() {
  const user = await verifyToken();
  if (user?.role == "it" || user?.role=="admin") {
    redirect("/dashboard")
  }
  return (
    <ProtectedRoute>
      <MyTicketsContent />
    </ProtectedRoute>
  )
}
