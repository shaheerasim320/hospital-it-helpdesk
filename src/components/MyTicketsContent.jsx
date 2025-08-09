"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Calendar, Building, AlertCircle, Clock, CheckCircle, Loader2 } from "lucide-react"
import Navbar from "./navbar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useAuthStore from "@/store/useAuthStore"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../app/lib/firebase"

export default function MyTicketsContent() {
  const router = useRouter();
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore()

  useEffect(() => {
    async function fetchTickets() {
      try {
        const q = query(
          collection(db, "tickets"),
          where("submittedByEmail", "==", user?.email)
        );
        const snapshot = await getDocs(q);
        const userTickets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(userTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [user, router]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tickets</h1>
            <p className="text-gray-600">Track the status of your IT support requests</p>
          </div>
          <Link href="/submit-ticket">
            <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Submit New Ticket
            </Button>
          </Link>
        </div>

        {/* Tickets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {ticket.title}
                    </CardTitle>
                    <div className="text-sm text-gray-500 mb-3">Ticket #{ticket.ticketId}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {ticket.department}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Submitted: {new Date(ticket.dateSubmitted).toLocaleDateString()}
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-700 line-clamp-3">{ticket.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <Link href={`/ticket/${ticket.ticketId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-6">You haven't submitted any support tickets yet.</p>
            <Link href="/submit-ticket">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Submit Your First Ticket
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
