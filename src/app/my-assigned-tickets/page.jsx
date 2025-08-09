import AssignedTicketsList from "@/components/AssignedTicketsList"
import ProtectedRoute from "@/components/ProtectedRoute"
import { verifyToken } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function MyAssignedTickets() {
    const user = await verifyToken();
    if (user?.role !== "admin" && user?.role !== "it") {
        redirect("/dashboard")
    }
    return (
        <ProtectedRoute>
            <AssignedTicketsList showNavbar={true} showButton={user?.role == "admin" ? true : false} />
        </ProtectedRoute>
    )
}
