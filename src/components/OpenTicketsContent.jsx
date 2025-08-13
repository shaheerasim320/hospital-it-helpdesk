"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Filter,
  Calendar,
  Building,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
  Eye,
  UserPlus,
  Plus,
} from "lucide-react"
import Navbar from "./navbar"
import useTicketStore from "@/store/useTicketStore"
import useAuthStore from "@/store/useAuthStore"

export default function OpenTicketsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [assigningTicketId, setAssigningTicketId] = useState(null)
  const [message, setMessage] = useState(null)
  const { openTickets, subscribeOpenTickets, unsubscribeOpenTickets, assignTicket } = useTicketStore();
  const { user } = useAuthStore()

  useEffect(() => {
    subscribeOpenTickets();

    return () => {
      unsubscribeOpenTickets();
    };
  }, [subscribeOpenTickets, unsubscribeOpenTickets]);

  // Sample unassigned tickets data
  const tickets = [
    {
      id: "TK-002",
      title: "Email server maintenance required",
      priority: "high",
      department: "IT",
      submittedBy: "System Administrator",
      submittedByEmail: "admin@hospital.com",
      dateSubmitted: "2024-01-18",
      description:
        "Email server showing high memory usage and needs maintenance. Affecting email delivery speed across the hospital.",
      urgency: "Critical - affects all departments",
    },
    {
      id: "TK-004",
      title: "Backup system failure",
      priority: "high",
      department: "IT",
      submittedBy: "Mike Chen",
      submittedByEmail: "mike.chen@hospital.com",
      dateSubmitted: "2024-01-17",
      description: "Daily backup system failed for the past 2 days. Patient data backup is at risk.",
      urgency: "Critical - data security risk",
    },
    {
      id: "TK-006",
      title: "WiFi connectivity issues in West Wing",
      priority: "medium",
      department: "Facilities",
      submittedBy: "Janet Wilson",
      submittedByEmail: "janet.wilson@hospital.com",
      dateSubmitted: "2024-01-16",
      description: "Multiple reports of weak WiFi signal in the West Wing. Staff unable to access systems reliably.",
      urgency: "Moderate - affects staff productivity",
    },
    {
      id: "TK-008",
      title: "Security camera system offline",
      priority: "medium",
      department: "Security",
      submittedBy: "David Brown",
      submittedByEmail: "david.brown@hospital.com",
      dateSubmitted: "2024-01-15",
      description: "Security cameras in parking lot B are offline. Need immediate repair for safety compliance.",
      urgency: "Moderate - security concern",
    },
    {
      id: "TK-010",
      title: "Software update needed for lab equipment",
      priority: "low",
      department: "Laboratory",
      submittedBy: "Dr. Lisa Chen",
      submittedByEmail: "lisa.chen@hospital.com",
      dateSubmitted: "2024-01-14",
      description: "Lab analysis software needs update to latest version for new test protocols.",
      urgency: "Low - scheduled maintenance",
    },
    {
      id: "TK-011",
      title: "Phone system extension issues",
      priority: "low",
      department: "Administration",
      submittedBy: "Mary Johnson",
      submittedByEmail: "mary.johnson@hospital.com",
      dateSubmitted: "2024-01-13",
      description: "Several phone extensions not working properly. Calls not routing correctly to departments.",
      urgency: "Low - workaround available",
    },
  ]

  const showToast = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAssignToMe = async (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    try {
      setAssigningTicketId(ticketId);
      await assignTicket(ticketId, user.id);
      showToast("success", `Ticket ${ticket.tickedId} has been assigned to you.`)
    } catch (error) {
      console.error("Error assigning ticket:", error);
      showToast("error", "Failed to assign the ticket.");
    } finally {
      setAssigningTicketId(null);
    }
  }

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: "bg-blue-100 text-blue-800 border-blue-200",
      medium: "bg-orange-100 text-orange-800 border-orange-200",
      high: "bg-red-100 text-red-800 border-red-200",
    }

    return <Badge className={`${priorityColors[priority]} capitalize px-2 py-1`}>{priority}</Badge>
  }



  const departments = [...new Set(openTickets.map((ticket) => ticket.department))]

  const filteredTickets = openTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority
    const matchesDepartment = filterDepartment === "all" || ticket.department === filterDepartment

    return matchesSearch && matchesPriority && matchesDepartment
  })

  const getDepartmentInfo = (departmentValue) => {
    const departments = {
      emergency: "Emergency Medicine",
      radiology: "Radiology",
      cardiology: "Cardiology",
      neurology: "Neurology",
      nursing: "Nursing",
      oncology: "Oncology",
      orthopedics: "Orthopedics",
      pediatrics: "Pediatrics",
      pharmacy: "Pharmacy",
      laboratory: "Laboratory",
      surgery: "Surgery",
      icu: "Intensive Care Unit (ICU)",
      it: "Information Technology (IT)",
      hr: "Human Resources (HR)",
      administration: "Administration",
      facilities: "Facilities & Maintenance",
      billing: "Billing & Insurance",
    };

    return departments[departmentValue] || "Unknown Department";
  };

  const stats = {
    total: openTickets.length,
    high: openTickets.filter((t) => t.priority === "high").length,
    medium: openTickets.filter((t) => t.priority === "medium").length,
    low: openTickets.filter((t) => t.priority === "low").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Open Tickets</h1>
            <p className="text-gray-600">Unassigned tickets waiting for IT support</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-gray-500" />
                Total Open
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.high}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Medium Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.medium}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                Low Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.low}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Filter Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                  Search Tickets
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by title, ID, or submitter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="priority-filter" className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter by Priority
                </Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department-filter" className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter by Department
                </Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Open Tickets ({filteredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Ticket Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{ticket.title}</h3>
                          <p className="text-sm text-gray-600">#{ticket.ticketId}</p>
                        </div>
                        <div className="flex items-center space-x-2">{getPriorityBadge(ticket.priority)}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          Submitted by: {ticket.submittedBy}
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          Department: {getDepartmentInfo(ticket.department)}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Submitted: {new Date(ticket.dateSubmitted).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{ticket.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 min-w-40">
                      <Button
                        size="sm"
                        onClick={() => handleAssignToMe(ticket.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {assigningTicketId === ticket.id ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                            Assigning...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Assign to Me
                          </>
                        )}
                      </Button>
                      <Link href={`/ticket/${ticket.ticketId}`}>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No open tickets found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterPriority !== "all" || filterDepartment !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "All tickets have been assigned! Great work."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
