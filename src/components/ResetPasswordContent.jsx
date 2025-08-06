"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, Lock, ArrowLeft, CheckCircle, AlertCircle, Shield, Eye, EyeOff, Key, Clock } from "lucide-react"

export default function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  useEffect(() => {
    if (!token || !email) {
      setTokenValid(false)
      setMessage({
        type: "error",
        text: "Invalid or missing reset link. Please request a new password reset.",
      })
      return
    }

    // Simulate token validation (in real app, this would be an API call)
    setTimeout(() => {
      // For demo purposes, let's simulate token expiration
      const tokenAge = Math.random() * 20 // Random age in minutes
      if (tokenAge > 15) {
        setTokenValid(false)
        setMessage({
          type: "error",
          text: "This password reset link has expired. Please request a new one.",
        })
      } else {
        setTokenValid(true)
        setTimeRemaining(Math.ceil(15 - tokenAge))
      }
    }, 1000)
  }, [token, email])

  // Countdown timer for token expiration
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTokenValid(false)
            setMessage({
              type: "error",
              text: "This password reset link has expired. Please request a new one.",
            })
            return 0
          }
          return prev - 1
        })
      }, 60000) // Update every minute

      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match. Please try again.",
      })
      setIsSubmitting(false)
      return
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setMessage({
        type: "error",
        text: "Password does not meet security requirements. Please check the requirements below.",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call to reset password
    setTimeout(() => {
      // In real app, this would make an API call with token, email, and new password
      setMessage({
        type: "success",
        text: "Your password has been reset successfully! You can now sign in with your new password.",
      })
      setIsSuccess(true)
      setIsSubmitting(false)
    }, 2000)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const passwordValidation = validatePassword(formData.password)

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Success Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
          <div className="relative">
            <div className="w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Password Reset Complete</h2>
            <p className="text-lg text-gray-600 max-w-md">
              Your password has been successfully updated. You can now sign in with your new password.
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
              <CardTitle className="text-2xl font-bold text-gray-800">Password Reset Successful</CardTitle>
              <CardDescription className="text-gray-600">Your password has been updated successfully</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> Your password has been reset. You can now sign in to your account.
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Security Notice:</p>
                    <p className="text-sm text-blue-700">
                      For your security, you have been signed out of all devices. Please sign in again with your new
                      password.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/login">
                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Sign In Now
                </Button>
              </Link>

              <div className="pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  Need help? Contact IT Support: <span className="font-medium">ext. 911</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile illustration */}
        <div className="lg:hidden flex flex-col items-center space-y-4 order-first">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">Password Reset Complete</h1>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-4 pb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Invalid Reset Link</CardTitle>
          <CardDescription className="text-gray-600">
            This password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {message && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Request New Reset Link</Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Loading state
  if (tokenValid === null) {
    return (
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </CardContent>
      </Card>
    )
  }

  // Main reset password form
  return (
    <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
        <div className="relative">
          <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
            <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">Create New Password</h2>
          <p className="text-lg text-gray-600 max-w-md">
            Choose a strong, secure password for your hospital IT help desk account
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Secure Reset</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{timeRemaining} min left</span>
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
                <Key className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Reset Your Password</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter a new secure password for your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Resetting password for:</strong> {email}
              </p>
            </div>

            {/* Time Warning */}
            {timeRemaining && timeRemaining <= 5 && (
              <Alert className="border-orange-200 bg-orange-50">
                <Clock className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Hurry!</strong> This reset link expires in {timeRemaining} minute
                  {timeRemaining !== 1 ? "s" : ""}.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-11 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="h-11 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`w-3 h-3 ${passwordValidation.minLength ? "text-green-500" : "text-gray-400"}`}
                      />
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasUpper ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`w-3 h-3 ${passwordValidation.hasUpper ? "text-green-500" : "text-gray-400"}`}
                      />
                      <span>One uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasLower ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`w-3 h-3 ${passwordValidation.hasLower ? "text-green-500" : "text-gray-400"}`}
                      />
                      <span>One lowercase letter</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`w-3 h-3 ${passwordValidation.hasNumber ? "text-green-500" : "text-gray-400"}`}
                      />
                      <span>One number</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${passwordValidation.hasSpecial ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`w-3 h-3 ${passwordValidation.hasSpecial ? "text-green-500" : "text-gray-400"}`}
                      />
                      <span>One special character</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !passwordValidation.isValid}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

            {message && (
              <Alert
                className={`${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
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

            <div className="text-center">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full h-11 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact IT Support: <span className="font-medium">ext. 911</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile illustration */}
      <div className="lg:hidden flex flex-col items-center space-y-4 order-first">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h1>
      </div>
    </div>
  )
}