"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Monitor,
  Server,
  Database,
  Wifi,
  Shield,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Activity,
  TrendingUp,
  Users,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react"
import Navbar from "./navbar"

export default function SystemStatusContent() {
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // System status data
  const [systemStatus, setSystemStatus] = useState({
    overall: "operational", // operational, degraded, outage
    services: [
      {
        name: "Network Infrastructure",
        status: "operational",
        uptime: "99.9%",
        responseTime: "12ms",
        icon: Wifi,
        description: "Hospital-wide network connectivity",
        lastIncident: "None in 30 days",
      },
      {
        name: "Email System",
        status: "operational",
        uptime: "99.8%",
        responseTime: "45ms",
        icon: Mail,
        description: "Email servers and communication",
        lastIncident: "Minor delay 2 days ago",
      },
      {
        name: "Database Servers",
        status: "operational",
        uptime: "99.95%",
        responseTime: "8ms",
        icon: Database,
        description: "Patient records and hospital data",
        lastIncident: "None in 45 days",
      },
      {
        name: "Phone System",
        status: "degraded",
        uptime: "98.2%",
        responseTime: "120ms",
        icon: Phone,
        description: "Hospital phone and paging system",
        lastIncident: "Extension issues ongoing",
      },
      {
        name: "Security Systems",
        status: "operational",
        uptime: "99.7%",
        responseTime: "25ms",
        icon: Shield,
        description: "Access control and surveillance",
        lastIncident: "Camera offline 1 day ago",
      },
      {
        name: "Backup Systems",
        status: "outage",
        uptime: "95.1%",
        responseTime: "N/A",
        icon: Server,
        description: "Data backup and recovery systems",
        lastIncident: "Backup failure - under repair",
      },
    ],
    metrics: {
      totalUsers: 1247,
      activeConnections: 892,
      serverLoad: 67,
      diskUsage: 78,
      memoryUsage: 82,
      networkTraffic: "2.4 GB/s",
    },
    recentAlerts: [
      {
        id: 1,
        type: "critical",
        message: "Backup system failure detected",
        timestamp: "2024-01-18 14:30",
        service: "Backup Systems",
      },
      {
        id: 2,
        type: "warning",
        message: "Phone system experiencing delays",
        timestamp: "2024-01-18 12:15",
        service: "Phone System",
      },
      {
        id: 3,
        type: "info",
        message: "Scheduled maintenance completed",
        timestamp: "2024-01-18 09:00",
        service: "Email System",
      },
    ],
  })

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call to refresh status
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 2000)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      operational: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      degraded: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertCircle },
      outage: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center space-x-1 px-2 py-1`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    )
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-500" />
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const getOverallStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "outage":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar userRole="IT" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">System Status</h1>
            <p className="text-gray-600">Real-time monitoring of hospital IT infrastructure</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-500" />
              Overall System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`text-2xl font-bold ${getOverallStatusColor(systemStatus.overall)}`}>
                  {systemStatus.overall.charAt(0).toUpperCase() + systemStatus.overall.slice(1)}
                </div>
                {getStatusBadge(systemStatus.overall)}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Services Operational</div>
                <div className="text-lg font-semibold text-gray-800">
                  {systemStatus.services.filter((s) => s.status === "operational").length} /{" "}
                  {systemStatus.services.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemStatus.metrics.activeConnections}</div>
              <div className="text-sm text-gray-600">of {systemStatus.metrics.totalUsers} total</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-green-500" />
                Server Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStatus.metrics.serverLoad}%</div>
              <div className="text-sm text-gray-600">CPU utilization</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <MemoryStick className="w-5 h-5 mr-2 text-orange-500" />
                Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{systemStatus.metrics.memoryUsage}%</div>
              <div className="text-sm text-gray-600">RAM utilization</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <HardDrive className="w-5 h-5 mr-2 text-purple-500" />
                Disk Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{systemStatus.metrics.diskUsage}%</div>
              <div className="text-sm text-gray-600">Storage utilization</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Services Status */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-blue-500" />
                Service Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-600">Uptime:</span>
                          <div className="font-medium text-gray-800">{service.uptime}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Response:</span>
                          <div className="font-medium text-gray-800">{service.responseTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Incident:</span>
                          <div className="font-medium text-gray-800 text-xs">{service.lastIncident}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.recentAlerts.map((alert) => (
                  <Alert key={alert.id} className={getAlertColor(alert.type)}>
                    {getAlertIcon(alert.type)}
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-800">{alert.message}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {alert.service} • {alert.timestamp}
                          </div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>

              {/* Network Traffic */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  Network Traffic
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Traffic:</span>
                    <span className="font-medium text-gray-800">{systemStatus.metrics.networkTraffic}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">65% of capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
