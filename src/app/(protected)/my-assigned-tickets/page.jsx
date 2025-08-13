import AssignedTicketsList from "@/components/AssignedTicketsList";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

async function getUserFromToken() {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
        return payload
    } catch {
        return null
    }
}

export default async function MyAssignedTickets() {
    const user = await getUserFromToken()
    if (!user) return null

    return (
        <AssignedTicketsList showNavbar={true} showButton={user.role === "admin"} />
    );
}
