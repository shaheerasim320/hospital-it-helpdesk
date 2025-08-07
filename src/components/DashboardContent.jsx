"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clipboard, Monitor, Stethoscope, Shield, Users, AlertCircle, Clock, CheckCircle } from "lucide-react"
import Navbar from "./navbar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useUserStore from "@/store/useUserStore"
import useTicketStore from "@/store/useTicketStore"

export default function DashboardContent() {
    const { user } = useUserStore();
    const { tickets } = useTicketStore();
    const [recentTickets, setRecentTickets] = useState([])
    const [assignedTickets, setAssignedTickets] = useState([])
    const [ticketStats, setTicketStats] = useState({ open: 0, inProgress: 0, resolved: 0 })
    const router = useRouter()

    useEffect(() => {
        if (user?.role === "admin") {
            router.push("/admin")
            return
        }

        if (user?.role === "it") {
            fetchAssignedTickets(user?.email)
            fetchTicketStats()
        } else {
            fetchRecentTickets(user?.email)
        }
    }, [router, user])

    // Different quick actions based on role
    const getQuickActions = (role) => {
        if (role === "it") {
            return [
                {
                    title: "My Assigned Tickets",
                    description: "View and resolve tickets assigned to you",
                    icon: Clipboard,
                    href: "/my-assigned-tickets",
                    color: "bg-blue-500",
                    hoverColor: "hover:bg-blue-600",
                },
                {
                    title: "All Open Tickets",
                    description: "View all unassigned tickets",
                    icon: AlertCircle,
                    href: "/open-tickets",
                    color: "bg-orange-500",
                    hoverColor: "hover:bg-orange-600",
                },
                {
                    title: "System Status",
                    description: "Monitor system health and performance",
                    icon: Monitor,
                    href: "/system-status",
                    color: "bg-green-500",
                    hoverColor: "hover:bg-green-600",
                },
            ]
        } else {
            return [
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
        }
    }

    const fetchRecentTickets = async (email) => {
        try {
            // Mock data for user's own tickets
            const mockData = [
                { id: 1, subject: "Printer not working", date: "2025-08-02", status: "open" },
                { id: 2, subject: "Email sync issue", date: "2025-08-01", status: "in-progress" },
                { id: 3, subject: "Software license expired", date: "2025-07-30", status: "resolved" },
            ]
            setRecentTickets(mockData)
        } catch (err) {
            console.error("Failed to fetch tickets:", err)
        }
    }

    const fetchAssignedTickets = async (email) => {
        try {
            // Mock data for IT staff assigned tickets
            const mockData = [
                {
                    id: "TK-001",
                    subject: "Computer won't start in Room 302",
                    priority: "high",
                    submittedBy: "Dr. Sarah Johnson",
                    department: "Emergency Medicine",
                    date: "2025-08-02",
                },
                {
                    id: "TK-003",
                    subject: "Network connectivity issues",
                    priority: "medium",
                    submittedBy: "Jennifer Adams",
                    department: "ICU",
                    date: "2025-08-01",
                },
                {
                    id: "TK-005",
                    subject: "Printer offline in Radiology",
                    priority: "low",
                    submittedBy: "Dr. Mark Stevens",
                    department: "Radiology",
                    date: "2025-07-31",
                },
            ]
            setAssignedTickets(mockData)
        } catch (err) {
            console.error("Failed to fetch assigned tickets:", err)
        }
    }

    const fetchTicketStats = async () => {
        try {
            // Mock stats for admin/IT
            setTicketStats({ open: 12, inProgress: 8, resolved: 45 })
        } catch (err) {
            console.error("Failed to fetch ticket stats:", err)
        }
    }

    const getPriorityBadge = (priority) => {
        const colors = {
            low: "bg-blue-100 text-blue-800",
            medium: "bg-orange-100 text-orange-800",
            high: "bg-red-100 text-red-800",
        }
        return <Badge className={`${colors[priority]} capitalize`}>{priority}</Badge>
    }

    const getStatusBadge = (status) => {
        const colors = {
            open: "bg-red-100 text-red-800",
            "in-progress": "bg-yellow-100 text-yellow-800",
            resolved: "bg-green-100 text-green-800",
        }
        return <Badge className={`${colors[status]} capitalize`}>{status.replace("-", " ")}</Badge>
    }


    const userRole = user?.role || "staff"
    const userName = user?.name || "User"
    const quickActions = getQuickActions(userRole)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <Navbar userRole={userRole} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userName}</h1>
                                <p className="text-gray-600 mb-4">
                                    {userRole === "it" ? "IT Support Dashboard - Hospital Help Desk" : "Hospital IT Help Desk Dashboard"}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userRole === "it" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        <Users className="w-4 h-4 mr-1" />
                                        {userRole === "it" ? "IT Support" : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
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
                                            <Button className={`w-full ${action.color} ${action.hoverColor} text-white`}>
                                                {userRole === "it" ? "Manage" : "Get Started"}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Role-specific content */}
                {userRole === "it" ? (
                    // IT Dashboard
                    <div className="space-y-6">
                        {/* Ticket Stats */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="shadow-lg border-0">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                                        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                                        Open Tickets
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-red-600 mb-2">{ticketStats.open}</div>
                                    <p className="text-sm text-gray-600">Require attention</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-0">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                                        In Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-yellow-600 mb-2">{ticketStats.inProgress}</div>
                                    <p className="text-sm text-gray-600">Being worked on</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-0">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                        Resolved Today
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600 mb-2">7</div>
                                    <p className="text-sm text-gray-600">Completed tickets</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Assigned Tickets for IT */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                                    <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
                                    My Assigned Tickets
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {assignedTickets.length > 0 ? (
                                    <div className="space-y-3">
                                        {assignedTickets.map((ticket) => (
                                            <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <h3 className="font-medium text-gray-800">#{ticket.id}</h3>
                                                            {getPriorityBadge(ticket.priority)}
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700 mb-1">{ticket.subject}</p>
                                                        <p className="text-xs text-gray-600">
                                                            Submitted by {ticket.submittedBy} • {ticket.department} • {ticket.date}
                                                        </p>
                                                    </div>
                                                    <Link href={`/ticket/${ticket.id}`}>
                                                        <Button size="sm" variant="outline" className="bg-transparent">
                                                            View
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Clipboard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-sm text-gray-600">No tickets assigned to you</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    // Regular User Dashboard (doctors, nurses, staff)
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
                                    My Recent Tickets
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentTickets.length > 0 ? (
                                    <ul className="space-y-3">
                                        {recentTickets.map((ticket) => (
                                            <li key={ticket.id} className="border-b pb-2 last:border-b-0">
                                                <div className="font-medium text-sm">{ticket.subject}</div>
                                                <div className="text-xs text-gray-500 flex items-center justify-between mt-1">
                                                    <span>Submitted on {ticket.date}</span>
                                                    {getStatusBadge(ticket.status)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-600">No recent tickets</p>
                                        <p className="text-xs text-gray-500 mt-1">Submit a ticket to get started</p>
                                    </div>
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
                )}
            </div>
        </div>
    )
}
