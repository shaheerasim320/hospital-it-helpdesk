"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Calendar,
  Building,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Edit3,
  Send,
  History,
} from "lucide-react"
import Navbar from "../../../components/navbar"

export default function TicketDetails({ ticketId = "TK-001", userRole = "Staff" }) {
  const router = useRouter()

  // Sample ticket data - in real app, this would be fetched based on ticketId
  const [ticket, setTicket] = useState({
    id: "TK-001",
    title: "Computer won't start in Room 302",
    status: "open",
    priority: "high",
    department: "Emergency Medicine",
    submittedBy: "Dr. Sarah Johnson",
    submittedByEmail: "sarah.johnson@hospital.com",
    assignedTo: null,
    dateSubmitted: "2024-01-15",
    lastUpdated: "2024-01-15",
    description:
      "Desktop computer in patient room 302 won't power on. Red light blinking on power button. This is affecting patient care as we cannot access the electronic health records system. The issue started this morning around 8 AM. I've tried unplugging and plugging back in, but the problem persists.",
    attachments: [],
  })

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "System",
      authorRole: "system",
      content: "Ticket created and assigned to IT Support queue.",
      timestamp: "2024-01-15T08:30:00",
      type: "system",
    },
    {
      id: 2,
      author: "Mike Chen",
      authorRole: "it",
      content:
        "I've received this ticket and will investigate the issue. Will check the power supply and connections first.",
      timestamp: "2024-01-15T09:15:00",
      type: "comment",
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [message, setMessage] = useState(null)

  // Sample agents for assignment
  const agents = [
    { id: 1, name: "Mike Chen", role: "it" },
    { id: 2, name: "Robert Wilson", role: "admin" },
  ]

  const showToast = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
      "in-progress": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      resolved: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center space-x-1 px-3 py-1`}>
        <Icon className="w-4 h-4" />
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

    return <Badge className={`${priorityColors[priority]} capitalize px-3 py-1`}>{priority}</Badge>
  }

  const handleStatusChange = (newStatus) => {
    setTicket({ ...ticket, status: newStatus, lastUpdated: new Date().toISOString().split("T")[0] })

    // Add system comment for status change
    const systemComment = {
      id: comments.length + 1,
      author: "System",
      authorRole: "system",
      content: `Ticket status changed to ${newStatus.replace("-", " ")}.`,
      timestamp: new Date().toISOString(),
      type: "system",
    }
    setComments([...comments, systemComment])

    showToast("success", `Ticket status updated to ${newStatus.replace("-", " ")}.`)
  }

  const handleAssignTicket = (agentId) => {
    const agent = agents.find((a) => a.id === Number.parseInt(agentId))
    setTicket({ ...ticket, assignedTo: agent ? agent.name : null, lastUpdated: new Date().toISOString().split("T")[0] })

    // Add system comment for assignment
    const systemComment = {
      id: comments.length + 1,
      author: "System",
      authorRole: "system",
      content: agent ? `Ticket assigned to ${agent.name}.` : "Ticket unassigned.",
      timestamp: new Date().toISOString(),
      type: "system",
    }
    setComments([...comments, systemComment])

    showToast("success", agent ? `Ticket assigned to ${agent.name}.` : "Ticket unassigned.")
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmittingComment(true)

    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: comments.length + 1,
        author: userRole === "Admin" ? "Admin User" : "Current User",
        authorRole: userRole.toLowerCase(),
        content: newComment,
        timestamp: new Date().toISOString(),
        type: "comment",
      }

      setComments([...comments, comment])
      setNewComment("")
      setIsSubmittingComment(false)
      showToast("success", "Comment added successfully.")
    }, 500)
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getAuthorBadgeColor = (role) => {
    const colors = {
      system: "bg-gray-100 text-gray-800",
      admin: "bg-purple-100 text-purple-800",
      it: "bg-blue-100 text-blue-800",
      doctor: "bg-green-100 text-green-800",
      nurse: "bg-teal-100 text-teal-800",
      staff: "bg-gray-100 text-gray-800",
    }
    return colors[role] || colors.staff
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar userRole={userRole} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href={userRole === "Admin" ? "/admin" : "/my-tickets"}>
              <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {userRole === "Admin" ? "Admin Panel" : "My Tickets"}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Ticket Details</h1>
              <p className="text-gray-600">#{ticket.id}</p>
            </div>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{ticket.title}</CardTitle>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ticket Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Submitted by</p>
                      <p className="text-gray-600">{ticket.submittedBy}</p>
                      <p className="text-sm text-gray-500">{ticket.submittedByEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Department</p>
                      <p className="text-gray-600">{ticket.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date Submitted</p>
                      <p className="text-gray-600">{new Date(ticket.dateSubmitted).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Updated</p>
                      <p className="text-gray-600">{new Date(ticket.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                </div>

                {/* Assignment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Assignment</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Assigned to:</span>
                    <span className={`text-sm ${ticket.assignedTo ? "text-gray-600" : "text-orange-600"}`}>
                      {ticket.assignedTo || "Unassigned"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Comments & Activity ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          {comment.type === "system" ? (
                            <History className="w-4 h-4 text-white" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-800">{comment.author}</span>
                          <Badge className={`text-xs ${getAuthorBadgeColor(comment.authorRole)}`}>
                            {comment.authorRole === "system" ? "System" : comment.authorRole.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                        </div>
                        <div
                          className={`text-sm p-3 rounded-lg ${
                            comment.type === "system"
                              ? "bg-blue-50 border border-blue-200 text-blue-800"
                              : "bg-gray-50 border border-gray-200 text-gray-700"
                          }`}
                        >
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Add Comment */}
                <div className="space-y-3">
                  <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
                    Add Comment
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Add a comment or update about this ticket..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmittingComment ? "Adding..." : "Add Comment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Actions */}
            {userRole === "Admin" && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2" />
                    Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Update */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Update Status</Label>
                    <Select value={ticket.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Assign Agent</Label>
                    <Select
                      value={
                        ticket.assignedTo ? agents.find((a) => a.name === ticket.assignedTo)?.id.toString() || "0" : "0"
                      }
                      onValueChange={handleAssignTicket}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                </CardContent>
              </Card>
            )}

            {/* Ticket Summary */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Ticket Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  {getStatusBadge(ticket.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Priority</span>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assigned to</span>
                  <span className="text-sm font-medium">{ticket.assignedTo || "Unassigned"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comments</span>
                  <span className="text-sm font-medium">{comments.filter((c) => c.type === "comment").length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={userRole === "Admin" ? "/admin" : "/my-tickets"}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to {userRole === "Admin" ? "Admin Panel" : "My Tickets"}
                  </Button>
                </Link>
                {userRole !== "Admin" && (
                  <Link href="/submit-ticket">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Submit New Ticket</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
