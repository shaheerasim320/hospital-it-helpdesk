import ProtectedRoute from "@/components/ProtectedRoute";
import SubmitTicketContent from "@/components/SubmitTicketContent";

export default function SubmitTicket() {
  return (
    <ProtectedRoute>
      <SubmitTicketContent />
    </ProtectedRoute>
  )
}
