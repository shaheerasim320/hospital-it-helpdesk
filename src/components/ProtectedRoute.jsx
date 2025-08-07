import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function ProtectedRoute({ children }) {
    const user = await getUserFromToken();
    if (!user) {
        redirect("/login")
    }
    return <>{children}</>
}