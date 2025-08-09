import ProtectedRoute from "@/components/ProtectedRoute";
import SystemStatusContent from "@/components/SystemStatusContent";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SystemStatus() {
  const user = await verifyToken()  
  if(user?.role!=="it"){
    redirect("/dashboard")
  }
  return(
    <ProtectedRoute>
      <SystemStatusContent/>
    </ProtectedRoute>
  )
}
