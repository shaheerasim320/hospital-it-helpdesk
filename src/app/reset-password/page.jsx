import ResetPasswordContent from "@/components/ResetPasswordContent";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
