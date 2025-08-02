"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton({ className = "", size = "default" }) {
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...")
    // Example: redirect to login page, clear tokens, etc.
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size={size}
      className={`flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}
