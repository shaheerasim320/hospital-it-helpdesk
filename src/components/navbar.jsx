"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Monitor, Home, FileText, Clipboard, Settings, LogOut } from "lucide-react"
import useUserStore from "@/store/useUserStore"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useUserStore()

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  const userRole = user?.role || "Guest"
  const userName = user?.name || "Unknown"

  const ticketLinkText = userRole == "IT".toLowerCase() ? "Tickets to Resolve" : "My Tickets";

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Hospital IT Help Desk</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={userRole == "Admin".toLowerCase() ? "/admin" : "/dashboard"}
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            {userRole !== "IT".toLowerCase() && (
              <Link
                href="/submit-ticket"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Submit Ticket
              </Link>
            )}
            <Link
              href={userRole == "IT".toLowerCase() ? "/my-assigned-tickets" : "/my-tickets"}
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              {ticketLinkText}
            </Link>

            {/* User info and logout */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              <span className="text-sm text-gray-600">
                <span className="font-medium">{userName}</span> ({userRole})
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="sm" className="text-gray-700">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
              <Link
                href={userRole == "Admin".toLowerCase() ? "/admin" : "/dashboard"}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Home className="w-4 h-4 mr-3" />
                Home
              </Link>
              {userRole !== "IT".toLowerCase() && (
                <Link
                  href="/submit-ticket"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Submit Ticket
                </Link>
              )}

              <Link
                href={userRole == "IT".toLowerCase() ? "/my-assigned-tickets" : "/my-tickets"}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Clipboard className="w-4 h-4 mr-3" />
                {ticketLinkText}
              </Link>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-gray-600">
                  {userName} <span className="font-medium">({userRole})</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="mx-3 mt-2 flex items-center text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
