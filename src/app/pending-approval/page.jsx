"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  CheckCircle,
  Mail,
  Shield,
  Users,
  Monitor,
  Stethoscope,
  Phone,
  RefreshCw,
  ArrowLeft,
  XCircle,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../lib/firebase"

export default function PendingApproval() {
  const [timeElapsed, setTimeElapsed] = useState("0 minutes")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState("pending")
  const [showStatusChange, setShowStatusChange] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("name")
  const userEmail = searchParams.get("email")
  useEffect(() => {
    if (!userName || !userEmail) {
      router.replace("/")
    }
  }, [userName, userEmail])

  useEffect(() => {
    const startTime = new Date()
    const interval = setInterval(() => {
      const now = new Date()
      const diffInMinutes = Math.floor((now - startTime) / (1000 * 60))

      if (diffInMinutes < 60) {
        setTimeElapsed(`${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`)
      } else {
        const hours = Math.floor(diffInMinutes / 60)
        const minutes = diffInMinutes % 60
        setTimeElapsed(
          `${hours} hour${hours !== 1 ? "s" : ""} ${minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : ""}`,
        )
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])


  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    try {
      const q = query(collection(db, "users"), where("email", "==", userEmail))
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const status = docSnap.data().status
        if (status !== approvalStatus) {
          setApprovalStatus(status)
          setShowStatusChange(true)
          setTimeout(() => setShowStatusChange(false), 3000)
        }

      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const statusInterval = setInterval(() => {
      if (approvalStatus === "pending") {
        handleRefreshStatus()
      }
    }, 30000)

    return () => clearInterval(statusInterval)
  }, [approvalStatus])

  return (
    <Suspense>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Request Under Review</h2>
              <p className="text-lg text-gray-600 max-w-md">
                Your access request is being reviewed by our IT administration team
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>1-2 Business Days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Notification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Status Information */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0">
              <CardHeader className="space-y-4 pb-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Account Pending Approval</CardTitle>
                <CardDescription className="text-gray-600">
                  Your request has been submitted successfully and is awaiting admin review
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Success Alert */}
                {approvalStatus === "approved" ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Request accepted successfully!</strong> You may now sign in to your Help Desk account.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Request submitted successfully!</strong> You will receive an email confirmation once your
                      account is approved.
                    </AlertDescription>
                  </Alert>
                )}


                {/* Status Change Notification */}
                {showStatusChange && approvalStatus === "approved" && (
                  <Alert className="border-green-200 bg-green-50 animate-pulse">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Great news!</strong> Your account has been approved! You can now sign in to the system.
                    </AlertDescription>
                  </Alert>
                )}

                {showStatusChange && approvalStatus === "rejected" && (
                  <Alert className="border-red-200 bg-red-50 animate-pulse">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Application Update:</strong> Your request needs additional review. Please contact IT support
                      for assistance.
                    </AlertDescription>
                  </Alert>
                )}

                {/* User Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Request submitted for:</p>
                      <p className="text-sm text-blue-700 font-medium">{userName}</p>
                      <p className="text-sm text-blue-600">{userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">What happens next?</h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Request Submitted</p>
                        <p className="text-xs text-gray-600">Your access request has been received</p>
                        <p className="text-xs text-green-600 font-medium">Completed • {timeElapsed} ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 ${approvalStatus === "approved"
                          ? "bg-green-500"
                          : approvalStatus === "rejected"
                            ? "bg-red-500"
                            : "bg-orange-500 animate-pulse"
                          } rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        {approvalStatus === "approved" ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : approvalStatus === "rejected" ? (
                          <XCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Clock className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Admin Review</p>
                        <p className="text-xs text-gray-600">
                          {approvalStatus === "approved"
                            ? "Your request has been approved by IT administration"
                            : approvalStatus === "rejected"
                              ? "Your request requires additional review"
                              : "IT administration is reviewing your request"}
                        </p>
                        <p
                          className={`text-xs font-medium ${approvalStatus === "approved"
                            ? "text-green-600"
                            : approvalStatus === "rejected"
                              ? "text-red-600"
                              : "text-orange-600"
                            }`}
                        >
                          {approvalStatus === "approved"
                            ? "Completed • Approved"
                            : approvalStatus === "rejected"
                              ? "Requires Action"
                              : "In Progress • Typically 1-2 business days"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 ${approvalStatus === "approved"
                          ? "bg-green-500"
                          : approvalStatus === "rejected"
                            ? "bg-red-500"
                            : "bg-orange-500 animate-pulse"
                          } rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        {approvalStatus === "approved" ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : approvalStatus === "rejected" ? (
                          <XCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Clock className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Email Notification</p>
                        <p className="text-xs text-gray-600">
                          {approvalStatus === "approved"
                            ? "Confirmation email has been sent to your inbox"
                            : approvalStatus === "rejected"
                              ? "No confirmation email sent"
                              : "You'll receive approval confirmation via email"}
                        </p>
                        <p
                          className={`text-xs font-medium ${approvalStatus === "approved"
                            ? "text-green-600"
                            : approvalStatus === "rejected"
                              ? "text-red-600"
                              : "text-orange-600"
                            }`}
                        >
                          {approvalStatus === "approved"
                            ? "Completed • Email Sent"
                            : approvalStatus === "rejected"
                              ? "Email Cancelled"
                              : "Pending"}
                        </p>
                      </div>
                    </div>


                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 ${approvalStatus === "approved"
                          ? "bg-green-500"
                          : approvalStatus === "rejected"
                            ? "bg-red-500"
                            : "bg-orange-500 animate-pulse"
                          } rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        {approvalStatus === "approved" ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : approvalStatus === "rejected" ? (
                          <XCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Clock className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Account Access</p>
                        <p className="text-xs text-gray-600">
                          {approvalStatus === "approved"
                            ? "You can now sign in and access the Help Desk system"
                            : approvalStatus === "rejected"
                              ? "Access denied. Please contact IT Support"
                              : "Sign in and start using the help desk system once approved"}
                        </p>
                        <p
                          className={`text-xs font-medium ${approvalStatus === "approved"
                            ? "text-green-600"
                            : approvalStatus === "rejected"
                              ? "text-red-600"
                              : "text-orange-600"
                            }`}
                        >
                          {approvalStatus === "approved"
                            ? "Access Granted"
                            : approvalStatus === "rejected"
                              ? "Access Denied"
                              : "Pending"}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {approvalStatus === "approved" ? (
                    <Link href="/login">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Sign In Now
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleRefreshStatus}
                      disabled={isRefreshing}
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      {isRefreshing ? "Checking Status..." : "Check Status"}
                    </Button>
                  )}

                  <Link href="/login">
                    <Button
                      variant={approvalStatus === "approved" ? "outline" : "default"}
                      className={`w-full ${approvalStatus === "approved"
                        ? "border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>

                {/* Important Information */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">Important:</p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Check your email regularly for approval updates</li>
                        <li>• Approval typically takes 1-2 business days</li>
                        <li>• Contact IT support if urgent access is needed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>Need immediate help? Contact IT Support</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">Extension: 911</p>
                    <p className="text-xs text-gray-500">Available 24/7 for emergency IT support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile illustration */}
          <div className="lg:hidden flex flex-col items-center space-y-4 order-first">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center animate-pulse">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center">Pending Approval</h1>
            <p className="text-sm text-gray-600 text-center">Your request is under review</p>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
