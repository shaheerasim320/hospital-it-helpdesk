import AssignedTicketsList from "@/components/AssignedTicketsList"
import ProtectedRoute from "@/components/ProtectedRoute"
import { verifyToken } from "@/lib/auth"

export default async function MyAssignedTickets() {
    const user = await verifyToken();

    return (
        <ProtectedRoute>
            <AssignedTicketsList showNavbar={true} showButton={user?.role == "admin" ? true : false} />
        </ProtectedRoute>
    )
}
