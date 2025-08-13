"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, Mail, ArrowLeft, CheckCircle, AlertCircle, Shield, Clock } from "lucide-react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage({
        type: "success",
        text: "Password reset instructions have been sent to your email address.",
      });
      setIsEmailSent(true);
    } catch (error) {
      let errorText = "Failed to send reset instructions.";
      if (error.code === "auth/invalid-email") {
        errorText = "Please enter a valid email address.";
      } else if (error.code === "auth/user-not-found") {
        errorText = "No account found with this email.";
      }

      setMessage({
        type: "error",
        text: errorText,
      });
      console.error("Error sending password reset email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Check Your Email</h2>
              <p className="text-lg text-gray-600 max-w-md">
                We've sent password reset instructions to your hospital email address
              </p>
            </div>
          </div>

          {/* Right side - Success Message */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0">
              <CardHeader className="space-y-4 pb-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Email Sent Successfully</CardTitle>
                <CardDescription className="text-gray-600">
                  Password reset instructions have been sent to your email
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800 mb-1">Email sent to:</p>
                      <p className="text-sm text-green-700">{email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <p>Check your hospital email inbox for the reset link</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <p>Click the secure reset link in the email</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <p>Create a new secure password</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">Security Tip:</p>
                      <p className="text-sm text-yellow-700">
                        Use a strong and unique password when resetting. Avoid using passwords from other accounts.
                      </p>
                    </div>
                  </div>
                </div>



                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setIsEmailSent(false)
                      setEmail("")
                      setMessage(null)
                    }}
                    variant="outline"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Send Another Email
                  </Button>

                  <Link href="/login">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Need immediate help? Contact IT Support: <span className="font-medium">ext. 911</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile illustration */}
          <div className="lg:hidden flex flex-col items-center space-y-4 order-first">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center">Email Sent</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
          <div className="relative">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Secure Password Reset</h2>
            <p className="text-lg text-gray-600 max-w-md">
              Enter your hospital email address and we'll send you secure instructions to reset your password
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure Process</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>15 Min Expiry</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Reset Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Reset Password</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Enter your hospital email address to receive password reset instructions
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Hospital Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Security Notice:</p>
                      <p className="text-sm text-blue-700">
                        Reset instructions will be sent only to verified hospital email addresses.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isSubmitting ? "Sending Instructions..." : "Send Reset Instructions"}
                </Button>
              </form>

              {message && (
                <Alert
                  className={`${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Remember your password?</span>
                </div>
              </div>

              <div className="text-center">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>Need immediate help? Contact IT: ext. 911</span>
                  </div>
                  <p className="text-xs text-gray-400">For security reasons, reset links expire after 15 minutes.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile illustration */}
        <div className="lg:hidden flex flex-col items-center space-y-4 order-first">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h1>
        </div>
      </div>
    </div>
  )
}
