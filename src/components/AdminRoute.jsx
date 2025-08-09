
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AdminRoute({ children }) {
    const user = await verifyToken();
    if (!user) {
        redirect('/login');
    }
    if (user.role !== 'admin') {
        redirect("/dashboard")
    }
    return <>{children}</>
}