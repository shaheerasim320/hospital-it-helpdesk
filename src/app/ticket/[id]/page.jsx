import ProtectedRoute from "@/components/ProtectedRoute";
import TicketDetailsContent from "@/components/TicketDetailsContent";

export default function TicketDetails() {
  return(
    <ProtectedRoute>
      <TicketDetailsContent/>
    </ProtectedRoute>
  )  
}
