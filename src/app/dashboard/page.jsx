"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clipboard, Monitor, Stethoscope, Shield, Users } from "lucide-react"
import Navbar from "../../components/navbar"
import useAuthStore from "@/store/useAuthStore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [recentTickets, setRecentTickets] = useState([])
  const { user } = useAuthStore();
  const router = useRouter();
  const quickActions = [
    {
      title: "Submit New Ticket",
      description: "Report a technical issue or request IT support",
      icon: FileText,
      href: "/submit-ticket",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      title: "View My Tickets",
      description: "Check the status of your submitted tickets",
      icon: Clipboard,
      href: "/my-tickets",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
  ]
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else {
      setAuthChecked(true);
      fetchRecentTickets(user.email)
    }
  }, [user])

  const fetchRecentTickets = async (email) => {
    try {
      // Replace this with actual DB call (Firebase/Supabase)
      const mockData = [
        { id: 1, subject: "Printer not working", date: "2025-08-02" },
        { id: 2, subject: "Email sync issue", date: "2025-08-01" },
      ]
      setRecentTickets(mockData)
    } catch (err) {
      console.error("Failed to fetch tickets:", err)
    }
  }
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const userRole = user?.role || "Guest"
  const userName = user?.name || "Unknown"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userName}</h1>
                <p className="text-gray-600 mb-4">Hospital IT Help Desk Dashboard</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Users className="w-4 h-4 mr-1" />
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Monitor className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card
                  key={index}
                  className="shadow-lg border-0 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">{action.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">{action.description}</CardDescription>
                    <Link href={action.href}>
                      <Button className={`w-full ${action.color} ${action.hoverColor} text-white`}>Get Started</Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network</span>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTickets.length > 0 ? (
                <ul className="space-y-2 text-sm text-gray-700">
                  {recentTickets.map((ticket) => (
                    <li key={ticket.id} className="border-b pb-2">
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="text-xs text-gray-500">Submitted on {ticket.date}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-600">No recent tickets</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-purple-500" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mon - Fri</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency</span>
                  <span className="font-medium text-red-600">24/7</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Emergency: ext. 911</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
