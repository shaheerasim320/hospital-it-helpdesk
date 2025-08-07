import MyTicketsContent from "@/components/MyTicketsContent";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyTickets() {
  return(
    <ProtectedRoute>
      <MyTicketsContent/>
    </ProtectedRoute>
  )  
}
