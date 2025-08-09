"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/app/lib/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, Monitor, Shield, Users, UserPlus, Lock, Mail, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HospitalSignup() {
  const [fullName, setFullName] = useState("")
  const [department, setDepartment] = useState("")
  const [role,setRole] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
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
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError("Password does not meet security requirements. Please check the requirements below.")
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user


      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: fullName,
        department,
        role: role,
        status: "pending",
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });


      toast.success("Signup successful! Waiting for admin approval.")
      router.push(`/pending-approval?name=${fullName}&email=${email}`)

    } catch (err) {
      console.error("Signup Error:", err);
      const msg =
        err.code === "auth/email-already-in-use"
          ? "Email already registered"
          : err.message;
      toast.error(msg);
    } finally {
      setLoading(false)
    }
  }
  const passwordValidation = validatePassword(password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
          <div className="relative">
            <div className="w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Join Our IT Support Team</h2>
            <p className="text-lg text-gray-600 max-w-md">
              Request access to our secure hospital IT help desk system and get the technical support you need
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Staff Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Create Account</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Request access to the Hospital IT Help Desk portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Department */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={department}
                    onValueChange={(value) => setDepartment(value)}
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Medicine</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="oncology">Oncology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="icu">Intensive Care Unit (ICU)</SelectItem>
                      <SelectItem value="it">Information Technology (IT)</SelectItem>
                      <SelectItem value="hr">Human Resources (HR)</SelectItem>
                      <SelectItem value="administration">Administration</SelectItem>
                      <SelectItem value="facilities">Facilities & Maintenance</SelectItem>
                      <SelectItem value="billing">Billing & Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Role */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="department">Role</Label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value)}
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="it">IT Support</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Hospital Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@hospital.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {password && (
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


                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Requesting..." : "Request Access"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Already have access?</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Sign in to your existing account</p>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-11 border-green-200 text-green-600 hover:bg-green-50">
                    Sign In to Help Desk
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>Need help? Contact IT: ext. 911</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    By creating an account, you agree to our security policies and HIPAA compliance requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile illustration */}
        <div className="lg:hidden flex flex-col items-center space-y-4 order-first">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">Hospital IT Help Desk</h1>
          <p className="text-sm text-gray-600 text-center">Request Access</p>
        </div>
      </div>
    </div>
  )
}
