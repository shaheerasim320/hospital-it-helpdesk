"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, Stethoscope, Shield, Headphones, CheckCircle, AlertCircle } from "lucide-react"
import Navbar from "../../components/navbar"

export default function SubmitTicket() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    department: "",
  })
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: "success",
        text: "Ticket submitted successfully! You will receive a confirmation email shortly.",
      })
      setFormData({ title: "", description: "", priority: "", department: "" })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar illustration */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <Monitor className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <Stethoscope className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <Headphones className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Technical Support?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Submit a detailed ticket and our IT team will assist you promptly.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-4 h-4 text-blue-500" />
                      <span>24/7 Support Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-teal-500" />
                      <span>Expert IT Staff</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Emergency IT Support: <br />
                      <span className="font-medium">ext. 911</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800">Submit Support Ticket</CardTitle>
                <CardDescription className="text-gray-600">
                  Describe your technical issue and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Issue Title *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                      Department *
                    </Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="e.g., Emergency Medicine, Radiology"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                      Priority Level *
                    </Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry or minor issue</SelectItem>
                        <SelectItem value="medium">Medium - Affects daily work but not critical</SelectItem>
                        <SelectItem value="high">High - Critical issue affecting patient care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Detailed Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about the issue, including any error messages, steps to reproduce, and impact on your work..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="min-h-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Support Ticket"}
                    </Button>
                  </div>
                </form>

                {message && (
                  <Alert
                    className={`mt-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
