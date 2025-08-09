import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function ProtectedRoute({ children }) {
    const user = await verifyToken();
    if (!user) {
        redirect("/login")
    }
    return <>{children}</>
}