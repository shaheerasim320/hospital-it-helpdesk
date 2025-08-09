import DashboardContent from "@/components/DashboardContent";
import ProtectedRoute from "@/components/ProtectedRoute";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await verifyToken()
  if(user?.role=="admin"){
    redirect("/admin")
  }
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
