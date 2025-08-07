
import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AdminRoute({ children }) {
    const user = await getUserFromToken();
    if (!user || user.role !== 'admin') {
        redirect('/login');
    }
    return <>{children}</>
}