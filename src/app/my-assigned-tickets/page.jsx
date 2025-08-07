import AssignedTicketsList from "@/components/AssignedTicketsList"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getUserFromToken } from "@/lib/auth"

export default async function MyAssignedTickets() {
    const user = await getUserFromToken();

    return (
        <ProtectedRoute>
            <AssignedTicketsList showNavbar={true} showButton={user?.role == "admin" ? true : false} />
        </ProtectedRoute>
    )
}
