"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Building, AlertCircle, Clock, CheckCircle, User, Eye, Plus } from "lucide-react"
import Navbar from "../../components/navbar"
import AssignedTicketsList from "@/components/AssignedTicketsList"
import useAuthStore from "@/store/useAuthStore"

export default function MyAssignedTickets() {
    const {user} = useAuthStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")

    // Sample assigned tickets data
    const tickets = [
        {
            id: "TK-001",
            title: "Computer won't start in Room 302",
            status: "open",
            priority: "high",
            department: "Emergency Medicine",
            submittedBy: "Dr. Sarah Johnson",
            submittedByEmail: "sarah.johnson@hospital.com",
            dateSubmitted: "2024-01-15",
            lastUpdated: "2024-01-15",
            description:
                "Desktop computer in patient room 302 won't power on. Red light blinking on power button. This is affecting patient care as we cannot access the electronic health records system.",
        },
        {
            id: "TK-003",
            title: "Network connectivity issues in ICU",
            status: "in-progress",
            priority: "high",
            department: "ICU",
            submittedBy: "Jennifer Adams",
            submittedByEmail: "jennifer.adams@hospital.com",
            dateSubmitted: "2024-01-16",
            lastUpdated: "2024-01-17",
            description:
                "Intermittent network connectivity affecting patient monitoring systems. Multiple devices losing connection every 10-15 minutes.",
        },
        {
            id: "TK-005",
            title: "Printer offline in Radiology",
            status: "in-progress",
            priority: "medium",
            department: "Radiology",
            submittedBy: "Dr. Mark Stevens",
            submittedByEmail: "mark.stevens@hospital.com",
            dateSubmitted: "2024-01-14",
            lastUpdated: "2024-01-16",
            description:
                "Main printer showing offline status, unable to print patient reports. Backup printer is working but slower.",
        },
        {
            id: "TK-007",
            title: "Software license expired - Pharmacy system",
            status: "open",
            priority: "medium",
            department: "Pharmacy",
            submittedBy: "Lisa Park",
            submittedByEmail: "lisa.park@hospital.com",
            dateSubmitted: "2024-01-10",
            lastUpdated: "2024-01-10",
            description:
                "Pharmacy management software showing license expiration warning. System will be unusable in 3 days.",
        },
        {
            id: "TK-009",
            title: "Email sync issues on mobile devices",
            status: "open",
            priority: "low",
            department: "Cardiology",
            submittedBy: "Dr. Emily Rodriguez",
            submittedByEmail: "emily.rodriguez@hospital.com",
            dateSubmitted: "2024-01-12",
            lastUpdated: "2024-01-12",
            description:
                "Hospital email not syncing properly on iPhone and Android devices. Missing recent messages and calendar events.",
        },
    ]

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
    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.department.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
        const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority

        return matchesSearch && matchesStatus && matchesPriority
    })

    // Statistics
    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "open").length,
        inProgress: tickets.filter((t) => t.status === "in-progress").length,
        high: tickets.filter((t) => t.priority === "high").length,
    }

    return (
        <AssignedTicketsList showNavbar={true} showButton={user?.role == "admin" ? true : false} />
    )
}
