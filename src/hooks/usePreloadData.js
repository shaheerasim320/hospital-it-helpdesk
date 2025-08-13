"use client"

import { useEffect } from "react"
import useTicketStore from "@/store/useTicketStore"
import useAdminStore from "@/store/useAdminStore"
import useSystemStatusStore from "@/store/useSystemStatusStore"

export default function usePreloadData(user) {
  const {
    fetchTickets,
    fetchRecentTickets,
    subscribeOpenTickets,
    unsubscribeOpenTickets,
    subscribeAssignedTickets,
    unsubscribeAssignedTickets,
    subscribeMyTickets,
    unsubscribeMyTickets,
    subscribeTicketStats,
    unsubscribeTicketStats,
  } = useTicketStore()

  const { subscribeSystemStatuses, unsubscribeSystemStatuses, subscribeStats, unsubscribeStats, subscribeRecentAlerts, unsubscribeRecentAlerts } = useSystemStatusStore()

  const { fetchStaff } = useAdminStore()

  useEffect(() => {
    if (!user) return

    switch (user.role) {
      case "IT Support":
        subscribeOpenTickets()
        subscribeAssignedTickets(user.id)
        subscribeTicketStats()
        subscribeSystemStatuses()
        subscribeStats()
        subscribeRecentAlerts()
        break;

      case "Administrator":
        fetchStaff()
        fetchTickets()
        subscribeAssignedTickets(user.id)
        break;

      default:
        if (user.email) {
          fetchRecentTickets(user.email)
          subscribeMyTickets(user.email)

        }
    }

    return () => {
      unsubscribeOpenTickets()
      unsubscribeAssignedTickets()
      unsubscribeMyTickets()
      unsubscribeTicketStats()
      unsubscribeSystemStatuses()
      unsubscribeStats()
      unsubscribeRecentAlerts()
    };
  }, [
    user,
    fetchStaff,
    fetchTickets,
    fetchRecentTickets,
    subscribeOpenTickets,
    unsubscribeOpenTickets,
    subscribeAssignedTickets,
    unsubscribeAssignedTickets,
    subscribeMyTickets,
    unsubscribeMyTickets,
    subscribeTicketStats,
    unsubscribeTicketStats,
    subscribeSystemStatuses,
    unsubscribeSystemStatuses,
    subscribeStats,
    unsubscribeStats,
    subscribeRecentAlerts,
    unsubscribeRecentAlerts,
  ]);
}
