"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Paperclip,
  Download,
  Loader2,
  Settings,
} from "lucide-react"
import Navbar from "./navbar"
import { collection, getDoc, getDocs, query, where } from "firebase/firestore"
import useAdminStore from "@/store/useAdminStore"
import useTicketStore from "@/store/useTicketStore"
import useAuthStore from "@/store/useAuthStore"
import { db } from "@/lib/firebase"

export default function TicketDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id
  const { user } = useAuthStore()
  const { staff, fetchStaff } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [message, setMessage] = useState(null)
  const { addComment, assignTicket, updateTicketStatus } = useTicketStore()

  useEffect(() => {
    if (!ticketId) {
      router.push("/login")
    }
    const fecthTicket = async () => {
      try {
        const q = query(collection(db, "tickets"), where("ticketId", "==", ticketId))
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setTicket({ id: docSnap.id, ...docSnap.data() })
          setComments(docSnap.data().comments || [])
          await fetchStaff()
        } else {
          router.replace("/error")
        }
      } catch (error) {
        console.log("Error loading ticket:", error)
      } finally {
        setLoading(false)
      }
    }
    fecthTicket()

  }, [ticketId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const agents = staff.filter((user) => user.status === "approved" && (user.role === "it" || user.role === "admin"))

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
    const Icon = config?.icon || AlertCircle

    return (
      <Badge className={`${config?.color} flex items-center space-x-1 px-3 py-1`}>
        <Icon className="w-4 h-4" />
        <span className="capitalize">{status?.replace("-", " ")}</span>
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

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatus(ticket.id, newStatus)
      setTicket({ ...ticket, status: newStatus, lastUpdated: new Date().toISOString() })
      const systemComment = {
        id: comments.length + 1,
        author: "System",
        authorRole: "system",
        content: `Ticket status changed to ${newStatus.replace("-", " ")}.`,
        timestamp: new Date().toISOString(),
        type: "system",
      }
      await addComment(ticket.id, systemComment)
      setComments([...comments, systemComment])
      showToast("success", `Ticket status updated to ${newStatus.replace("-", " ")}.`)
    } catch (error) {
      console.error("Error updating ticket status:", error);
      showToast("error", "Failed to update ticket status.");
    }
  }

  const handleAssignTicket = async (agentId) => {
    const agent = staff.find((u) => u.id === agentId)
    setTicket({ ...ticket, assignedTo: agent ? agent.id : null, lastUpdated: new Date().toISOString() })
    try {
      await assignTicket(ticket.id, agentId)
      showToast("success", `Ticket ${ticket.ticketId} has been assigned to ${agent ? agent.name : "Unassigned"}.`)
      const systemComment = {
        id: comments.length + 1,
        author: "System",
        authorRole: "system",
        content: agent ? `Ticket assigned to ${agent.name}.` : "Ticket unassigned.",
        timestamp: new Date().toISOString(),
        type: "system",
      }
      await addComment(ticket.id, systemComment)
      setComments(prev => [...prev, systemComment])
    } catch (error) {
      console.error("Error assigning ticket:", err);
      showToast("error", "Failed to assign the ticket.");
    }
  }


  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmittingComment(true)

    const comment = {
      id: Date.now(),
      author: user.name,
      authorEmail: user.email,
      authorRole: user.role.toLowerCase(),
      content: newComment.trim(),
      type: "comment",
      timestamp: new Date().toISOString(),
    };

    try {
      await addComment(ticket.id, comment)
      setComments(prev => [...prev, comment])
      setNewComment("")
      showToast("success", "Comment added successfully.")
    } catch (error) {
      showToast("error", "Failed to add comment")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleAttachmentsChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUploadAttachments = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {

      const uploadedURLs = await uploadFilesToCloudinary(selectedFiles, ticket.id);
      const updatedAttachments = [...(ticket.attachments || []), ...uploadedURLs];

      await updateDoc(doc(db, "tickets", ticket.id), {
        attachments: updatedAttachments,
        lastUpdated: new Date().toISOString(),
      });

      setTicket((prev) => ({
        ...prev,
        attachments: updatedAttachments,
        lastUpdated: new Date().toISOString(),
      }));

      setSelectedFiles([]);
    } catch (error) {
      console.error("Attachment upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
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
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href={user?.role === "Admin" ? "/admin" : user?.role === "IT Support" ? "/my-assigned-tickets" : "/my-tickets"}>
              <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {user?.role === "Admin" ? "Admin Panel" : user?.role === "IT Support" ? "My Assigned Tickets" : "My Tickets"}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Ticket Details</h1>
              <p className="text-gray-600">#{ticket?.ticketId}</p>
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
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{ticket?.title}</CardTitle>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(ticket?.status)}
                      {getPriorityBadge(ticket?.priority)}
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
                      <p className="text-gray-600">{ticket?.submittedBy}</p>
                      <p className="text-sm text-gray-500">{ticket?.submittedByEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Department</p>
                      <p className="text-gray-600">{getDepartmentInfo(ticket?.department)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date Submitted</p>
                      <p className="text-gray-600">{new Date(ticket?.dateSubmitted).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Updated</p>
                      <p className="text-gray-600">{new Date(ticket?.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket?.description}</p>
                  </div>
                </div>

                {/* Attachments */}
                {ticket?.attachments && ticket?.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Paperclip className="w-5 h-5 mr-2" />
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {(ticket?.attachments || []).map((url, index) => {
                        const filename = url.split("/").pop();
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <span className="text-sm text-gray-700">{filename}</span>
                            <a
                              href={url}
                              download
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Download attachment"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Assignment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Assignment</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Assigned to:</span>
                    <span className={`text-sm ${ticket?.assignedTo ? "text-gray-600" : "text-orange-600"}`}>
                      {agents.find((a) => a.id === ticket.assignedTo)?.name || "Unassigned"}
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
                          className={`text-sm p-3 rounded-lg ${comment.type === "system"
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
                    disabled={ticket?.status === "resolved"}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={isSubmittingComment || !newComment.trim() || ticket?.status === "resolved"}
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
            {user?.role === "Admin" && ticket.status!=="resolved" && (
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
                    <Select value={ticket?.status} onValueChange={handleStatusChange}>
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
                      value={ticket?.assignedTo?.toString() || "0"}
                      onValueChange={handleAssignTicket}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue>
                          {ticket?.assignedTo
                            ? agents.find((a) => a.id.toString() === ticket.assignedTo.toString())?.name || "Unknown agent"
                            : "Select agent"}
                        </SelectValue>
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

            {/* IT Support Actions */}
            {user?.role === "IT Support" && ticket.assignedTo === user?.id && ticket.status!=="resolved" && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    IT Support Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Update */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Update Status</Label>
                    <Select value={ticket?.status} onValueChange={handleStatusChange}>
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

                  {/* Attachments Upload */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Add Attachments</Label>
                    <input
                      type="file"
                      multiple
                      onChange={handleAttachmentsChange}
                      className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
                    />
                  </div>

                  <Button
                    onClick={handleUploadAttachments}
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploading ? "Uploading..." : "Upload Attachments"}
                  </Button>
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
                  {getStatusBadge(ticket?.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Priority</span>
                  {getPriorityBadge(ticket?.priority)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assigned to</span>
                  <span className="text-sm font-medium">{agents.find((a) => a.id === ticket.assignedTo)?.name || "Unassigned"}</span>
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
                <Link href={user?.role === "Admin" ? "/admin" : user?.role === "IT Support" ? "/my-assigned-tickets" : "/my-tickets"}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to {user?.role === "Admin" ? "Admin Panel" : user?.role === "IT Support" ? "My Assigned Tickets" : "My Tickets"}
                  </Button>
                </Link>
                {user?.role !== "Admin" || user?.role !== "IT Support" && (
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
