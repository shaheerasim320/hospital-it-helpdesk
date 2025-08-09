import OpenTicketsContent from "@/components/OpenTicketsContent";
import ProtectedRoute from "@/components/ProtectedRoute";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function OpenTickets() {
  const user = await verifyToken()
  if (user?.role !== "it") {
    redirect("/dashboard")
  }
  return (
    <ProtectedRoute>
      <OpenTicketsContent />
    </ProtectedRoute>
  )
}
