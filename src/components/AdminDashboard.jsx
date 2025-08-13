"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  X,
  Ticket,
  AlertCircle,
  User,
  Calendar,
  Building,
  Loader2,
  Clipboard,
  Eye,
} from "lucide-react";

import Navbar from "./navbar"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/useAuthStore"
import useAdminStore from "@/store/useAdminStore"
import useTicketStore from "@/store/useTicketStore"
import AssignedTicketsList from "@/components/AssignedTicketsList"
import Link from "next/link"


export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { staff, fetchStaff, loading, updateRole } = useAdminStore()
  const { tickets, fetchTickets, loading: ticketLoading, error, assignTicket, updateTicketStatus } = useTicketStore();
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [ticketSearchTerm, setTicketSearchTerm] = useState("")
  const [ticketFilterStatus, setTicketFilterStatus] = useState("all")
  const [editingUser, setEditingUser] = useState(null)
  const [editingTicket, setEditingTicket] = useState(null)
  const [message, setMessage] = useState(null)
  const [approvingUserId, setApprovingUserId] = useState(null)
  const [rejectingUserId, setRejectingUserId] = useState(null)


  useEffect(() => {
    fetchTickets();
    fetchStaff();
  }, []);



  const roles = [
    { value: "admin", label: "Administrator", color: "bg-purple-100 text-purple-800" },
    { value: "it", label: "IT Support", color: "bg-blue-100 text-blue-800" },
    { value: "doctor", label: "Doctor", color: "bg-green-100 text-green-800" },
    { value: "nurse", label: "Nurse", color: "bg-teal-100 text-teal-800" },
    { value: "staff", label: "Staff", color: "bg-gray-100 text-gray-800" },
  ]

  const agents = staff.filter((user) => user.status === "approved" && (user.role === "it" || user.role === "admin"))

  const showToast = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const getRoleInfo = (roleValue) => {
    return roles.find((role) => role.value === roleValue) || roles[4]
  }

  const getDepartmentInfo = (departmentValue) => {
    const departments = {
      emergency: "Emergency Medicine",
      radiology: "Radiology",
      cardiology: "Cardiology",
      neurology: "Neurology",
      nursing:"Nursing",
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


  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
      "in-progress": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      resolved: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center space-x-1 px-2 py-1`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status.replace("-", " ")}</span>
      </Badge>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: "bg-blue-100 text-blue-800 border-blue-200",
      medium: "bg-orange-100 text-orange-800 border-orange-200",
      high: "bg-red-100 text-red-800 border-red-200",
    }

    return <Badge className={`${priorityColors[priority]} capitalize px-2 py-1`}>{priority}</Badge>
  }

  const handleApproveUser = async (userId) => {
    setApprovingUserId(userId);
    try {
      const res = await fetch("/api/users/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (res.ok) {
        await fetchStaff();
        showToast("success", `${result.name} has been approved and notified.`);
      } else {
        showToast("error", result.error || "Failed to approve user.");
      }
    } catch (error) {
      console.error("Approval error:", error);
      showToast("error", "Something went wrong while approving the user.");
    } finally {
      setApprovingUserId(null);
    }
  };

  const handleRejectUser = async (userId) => {
    setRejectingUserId(userId);
    try {
      const res = await fetch("/api/users/reject-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (res.ok) {
        await fetchStaff();
        showToast("success", `${result.name} has been rejected and notified.`);
      } else {
        showToast("error", result.error || "Failed to reject user.");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      showToast("error", "Something went wrong while rejecting the user.");
    } finally {
      setRejectingUserId(null);
    }
  };



  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole(userId, newRole);
      const user = staff.find((u) => u.id === userId);
      const fullName = user?.name || "User";

      showToast("success", `${fullName}'s role has been updated to ${newRole}.`);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update role:", error);
      showToast("error", "Failed to update user role.");
    }
  };
  const handleAssignTicket = async (ticketId, agentId) => {
    const agent = staff.find((u) => u.id === agentId)
    const ticket = tickets.find((t) => t.id === ticketId)
    try {
      await assignTicket(ticketId, agentId)
      showToast("success", `Ticket ${ticket.ticketId} has been assigned to ${agent ? agent.name : "Unassigned"}.`)
      setEditingTicket(null)
    } catch (error) {
      console.error("Error assigning ticket:", err);
      showToast("error", "Failed to assign the ticket.");
    }
  }

  const handleStatusChange = async (ticketId, newStatus) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    try {
      await updateTicketStatus(ticketId, newStatus)
      showToast("success", `Ticket ${ticket.ticketId} status updated to ${newStatus.replace("-", " ")}.`)
    } catch (error) {
      console.error("Error updating ticket status:", err);
      showToast("error", "Failed to update ticket status.");
    }
  }
  const filteredUsers = staff.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "approved" && user.status === "approved") ||
      (filterStatus === "pending" && user.status === "pending")

    return matchesSearch && matchesFilter
  })

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      ticket.submittedBy.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      ticket.department.toLowerCase().includes(ticketSearchTerm.toLowerCase())

    const matchesFilter = ticketFilterStatus === "all" || ticket.status === ticketFilterStatus

    return matchesSearch && matchesFilter
  })

  const userStats = {
    total: staff.length,
    approved: staff.filter((u) => u.status === "approved").length,
    pending: staff.filter((u) => u.status === "pending").length,
  };

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar userRole="Admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, tickets, and system settings for the Hospital IT Help Desk</p>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs for different admin sections */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 gap-2 md:gap-0 md:grid-cols-3 lg:w-[600px] h-full">
            <TabsTrigger value="tickets" className="flex items-center space-x-2">
              <Ticket className="w-4 h-4" />
              <span>Ticket Management</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger value="assigned-to-me" className="flex items-center space-x-2">
              <Clipboard className="w-4 h-4" />
              <span>Assigned to Me</span>
            </TabsTrigger>
          </TabsList>

          {/* Ticket Management Tab */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Ticket Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Ticket className="w-5 h-5 mr-2 text-blue-500" />
                    Total Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{ticketStats.total}</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    Open
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{ticketStats.open}</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Resolved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{ticketStats.resolved}</div>
                </CardContent>
              </Card>
            </div>

            {/* Ticket Filters */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Ticket Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="ticket-search" className="text-sm font-medium text-gray-700 mb-2 block">
                      Search Tickets
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="ticket-search"
                        type="text"
                        placeholder="Search by ticket ID, title, or submitter..."
                        value={ticketSearchTerm}
                        onChange={(e) => setTicketSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="sm:w-48">
                    <Label htmlFor="ticket-filter" className="text-sm font-medium text-gray-700 mb-2 block">
                      Filter by Status
                    </Label>
                    <Select value={ticketFilterStatus} onValueChange={setTicketFilterStatus}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tickets</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
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
                  All Tickets ({filteredTickets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTickets.map((ticket) =>{
                    const departmentInfo = getDepartmentInfo(ticket.department)
                    return(
                    <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Ticket Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-800">{ticket.title}</h3>
                              <p className="text-sm text-gray-600">#{ticket.ticketId}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              Submitted by: {ticket.submittedBy}
                            </div>
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2 text-gray-400" />
                              Department: {departmentInfo}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              Submitted: {new Date(ticket.dateSubmitted).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3">{ticket.description}</p>

                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-700 mr-2">Assigned to:</span>
                            <span className={ticket.assignedTo ? "text-gray-600" : "text-orange-600"}>
                              {agents.find((a) => a.id === ticket.assignedTo)?.name || "Unassigned"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 min-w-48">
                          {/* Status Update */}
                          <div>
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">Update Status</Label>
                            <Select
                              value={ticket.status}
                              onValueChange={(newStatus) => handleStatusChange(ticket.id, newStatus)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Agent Assignment */}
                          <div>
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">Assign Agent</Label>
                            <Select
                              value={
                                ticket.assignedTo
                                  ? agents.find((a) => a.id === ticket.assignedTo)?.id.toString() || "0"
                                  : "0"
                              }
                              onValueChange={(agentId) => handleAssignTicket(ticket.id, agentId)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Select agent" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Unassigned</SelectItem>
                                {agents.map((agent) => (
                                  <SelectItem key={agent.id} value={agent.id.toString()}>
                                    {agent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* View Details Button */}
                          <div className="flex flex-col space-y-2 min-w-32">
                            <Link href={`/ticket/${ticket.ticketId}`}>
                              <Button size="sm" className=" bg-blue-600 hover:bg-blue-700 text-white">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    )
                  })}

                  {filteredTickets.length === 0 && (
                    <div className="text-center py-8">
                      <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No tickets found</h3>
                      <p className="text-gray-600">
                        {ticketSearchTerm || ticketFilterStatus !== "all"
                          ? "Try adjusting your search or filter criteria."
                          : "No tickets have been submitted yet."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{userStats.total}</div>
                  <p className="text-sm text-gray-600">Registered users</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-green-500" />
                    Approved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{userStats.approved}</div>
                  <p className="text-sm text-gray-600">Active users</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{userStats.pending}</div>
                  <p className="text-sm text-gray-600">Awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            {/* User Filters */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                      Search Users
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        type="text"
                        placeholder="Search by name, email, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="sm:w-48">
                    <Label htmlFor="filter" className="text-sm font-medium text-gray-700 mb-2 block">
                      Filter by Status
                    </Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="approved">Approved Only</SelectItem>
                        <SelectItem value="pending">Pending Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role)
                    const isEditing = editingUser === user.id
                    const departmentInfo = getDepartmentInfo(user.department)

                    return (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* User Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="text-sm text-gray-500">{departmentInfo}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {user.status === "approved" ? (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Requested:{" "}{user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : "N/A"}</span>
                              {user.lastLogin && (
                                <span>Last Login: {new Date(user.lastLogin.toDate()).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>

                          {/* Role Management */}
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-700">Role:</span>
                              {isEditing ? (
                                <div className="flex items-center space-x-2">
                                  <Select
                                    value={user.role}
                                    onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                                  >
                                    <SelectTrigger className="w-40 h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                          {role.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingUser(null)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingUser(user.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {user.status === "approved" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectUser(user.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                disabled={rejectingUserId === user.id}
                              >
                                {rejectingUserId === user.id ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <UserX className="w-4 h-4 mr-1" />
                                )}
                                {rejectingUserId === user.id ? "Revoking..." : "Revoke"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleApproveUser(user.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={approvingUserId === user.id}
                              >
                                {approvingUserId === user.id ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <UserCheck className="w-4 h-4 mr-1" />
                                )}
                                {approvingUserId === user.id ? "Approving..." : "Approve"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No users found</h3>
                      <p className="text-gray-600">
                        {searchTerm || filterStatus !== "all"
                          ? "Try adjusting your search or filter criteria."
                          : "No users have registered yet."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assigned-to-me">
            <AssignedTicketsList showNavbar={false} showButton={true} fromAdmin={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
