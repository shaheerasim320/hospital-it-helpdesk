"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "@/app/lib/firebase"
import { toast } from "sonner"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Stethoscope, Monitor, Shield, Headphones } from "lucide-react"
import useAuthStore from "@/store/authStore"
import { doc, getDoc } from "firebase/firestore"

export default function LoginPage() {
  const setUser = useAuthStore((state) => state.setUser)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCred.user.uid

      const userRef = doc(db, "users", uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        toast.error("User data not found")
        await signOut(auth)
        setEmail("")
        setPassword("")
        return;
      }

      const userData = userSnap.data()

      if (userData.status !== "approved") {
        toast.error("Your account is pending admin approval.")
        await signOut(auth)
        setEmail("")
        setPassword("")
        return;
      }

      setUser({
        uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
      })

      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/user-not-found":
          toast.error("No account found with this email.");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address format.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many failed attempts. Please try again later.");
          break;
        case "auth/invalid-credential":
          toast.error("Invalid credentials. Please try again.")
          break;
        default:
          toast.error("Something went wrong. Please try again.");
      }
      setEmail("");
      setPassword("");
    }
    finally {
      setLoading(false)
    }
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
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Hospital IT Help Desk</h2>
            <p className="text-lg text-gray-600 max-w-md">
              Secure access to technical support and system management for healthcare professionals
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Welcome Back</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Sign in to access the Hospital IT Help Desk portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In to Help Desk"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Need access?</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">{"Don't have an account?"}</p>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                  >
                    Request Help Desk Access
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>Emergency IT Support: ext. 911</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile illustration */}
        <div className="lg:hidden flex flex-col items-center space-y-4 order-first">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">Hospital IT Help Desk</h1>
        </div>
      </div>
    </div>
  )
}
