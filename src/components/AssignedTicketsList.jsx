"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Building, AlertCircle, Clock, CheckCircle, User, Eye, Plus } from "lucide-react"
import Navbar from "./navbar"
import useTicketStore from "@/store/useTicketStore"
import useAuthStore from "@/store/useAuthStore"

const AssignedTicketsList = ({ showNavbar, showButton, fromAdmin = false }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")
    const { assignedTickets, subscribeAssignedTickets, unsubscribeAssignedTickets } = useTicketStore()
    const { user } = useAuthStore()
    useEffect(() => {
        if (user?.id) {
            subscribeAssignedTickets(user.id);
        }

        return () => {
            unsubscribeAssignedTickets();
        };
    }, [user?.id, subscribeAssignedTickets, unsubscribeAssignedTickets]);

    const getDepartmentInfo = (departmentValue) => {
        const departments = {
            emergency: "Emergency Medicine",
            radiology: "Radiology",
            cardiology: "Cardiology",
            neurology: "Neurology",
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

    // Filter tickets
    const filteredTickets = assignedTickets.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.department.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
        const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority

        return matchesSearch && matchesStatus && matchesPriority
    })

    // Statistics
    const stats = {
        total: assignedTickets.length,
        open: assignedTickets.filter((t) => t.status === "open").length,
        inProgress: assignedTickets.filter((t) => t.status === "in-progress").length,
        high: assignedTickets.filter((t) => t.priority === "high").length,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {showNavbar ? <Navbar userRole="IT" /> : ""}

            <div className={`max-w-7xl mx-auto ${fromAdmin == true ? "" : "lg:px-8 sm:px-6 px-4 py-8"}`}>
                {fromAdmin != true && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Assigned Tickets</h1>
                            <p className="text-gray-600">Tickets currently assigned to you for resolution</p>
                        </div>
                        {showButton && (
                            <Link href="/submit-ticket">
                                <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Ticket
                                </Button>
                            </Link>
                        )}

                    </div>
                )}


                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-500" />
                                Total Assigned
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
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
                            <div className="text-3xl font-bold text-red-600">{stats.open}</div>
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
                            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
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
                                <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Filter by Status
                                </Label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
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
                        </div>
                    </CardContent>
                </Card>

                {/* Tickets List */}
                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                            Assigned Tickets ({filteredTickets.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredTickets.map((ticket) => {
                                const departmentInfo = getDepartmentInfo(ticket.department)
                                return (
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

                                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{ticket.description}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col space-y-2 min-w-32">
                                                <Link href={`/ticket/${ticket.ticketId}`}>
                                                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {filteredTickets.length === 0 && (
                                <div className="text-center py-12">
                                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No assigned tickets found</h3>
                                    <p className="text-gray-600">
                                        {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                                            ? "Try adjusting your search or filter criteria."
                                            : "You don't have any tickets assigned to you yet."}
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

export default AssignedTicketsList