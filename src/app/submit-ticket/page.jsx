import ProtectedRoute from "@/components/ProtectedRoute";
import SubmitTicketContent from "@/components/SubmitTicketContent";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SubmitTicket() {
  const user = await verifyToken()
  if(user?.role==="it"){
    redirect("/dashboard")
  }
  return (

    <ProtectedRoute>
      <SubmitTicketContent />
    </ProtectedRoute>
  )
}
