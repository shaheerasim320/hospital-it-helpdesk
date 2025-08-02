"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
} from "lucide-react"

export default function PendingApproval() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const name = searchParams.get("name")
    const email = searchParams.get("email")

    useEffect(() => {
        if (!name || !email) {
            router.replace("/error");
        }
    }, [name, email, router]);

    const [timeElapsed, setTimeElapsed] = useState("0 minutes")
    const [isRefreshing, setIsRefreshing] = useState(false)

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
        }, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [])

    const handleRefreshStatus = () => {
        setIsRefreshing(true)
        // Simulate checking status
        setTimeout(() => {
            setIsRefreshing(false)
            // In a real app, this would check the actual approval status
        }, 1500)
    }

    return (
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
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    <strong>Request submitted successfully!</strong> You will receive an email confirmation once your
                                    account is approved.
                                </AlertDescription>
                            </Alert>

                            {/* User Information */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-800 mb-1">Request submitted for:</p>
                                        <p className="text-sm text-blue-700 font-medium">{name}</p>
                                        <p className="text-sm text-blue-600">{email}</p>
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
                                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Admin Review</p>
                                            <p className="text-xs text-gray-600">IT administration is reviewing your request</p>
                                            <p className="text-xs text-orange-600 font-medium">In Progress • Typically 1-2 business days</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Mail className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Email Notification</p>
                                            <p className="text-xs text-gray-600">You'll receive approval confirmation via email</p>
                                            <p className="text-xs text-gray-500 font-medium">Pending</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Users className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Account Access</p>
                                            <p className="text-xs text-gray-600">Sign in and start using the help desk system</p>
                                            <p className="text-xs text-gray-500 font-medium">Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleRefreshStatus}
                                    disabled={isRefreshing}
                                    variant="outline"
                                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                                    {isRefreshing ? "Checking Status..." : "Check Status"}
                                </Button>

                                <Link href="/login">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
    )
}
