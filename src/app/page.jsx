import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, Stethoscope, Shield, Headphones, Users, Clock, CheckCircle, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Secure, encrypted communication that meets healthcare compliance standards",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical assistance for critical healthcare operations",
    },
    {
      icon: Users,
      title: "Expert IT Staff",
      description: "Specialized healthcare IT professionals who understand your needs",
    },
    {
      icon: CheckCircle,
      title: "Fast Resolution",
      description: "Quick ticket processing and resolution to minimize downtime",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Hospital IT Help Desk</span>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Request Access</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Professional IT Support for
                <span className="text-blue-600 block">Healthcare Teams</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Secure, reliable technical support designed specifically for hospital staff and healthcare
                professionals. Get the IT assistance you need to focus on patient care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure</span>
                </div>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                  <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="w-20 h-20 bg-blue-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Monitor className="w-10 h-10 text-white" />
                      </div>
                      <div className="w-20 h-20 bg-green-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Stethoscope className="w-10 h-10 text-white" />
                      </div>
                      <div className="w-20 h-20 bg-teal-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Shield className="w-10 h-10 text-white" />
                      </div>
                      <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Headphones className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Why Choose Our IT Help Desk?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for healthcare environments with the security, reliability, and expertise your medical
              team needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join hundreds of healthcare professionals who trust our IT support system. Request access today and
            experience professional technical support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Request Access Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Hospital IT Help Desk</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Professional IT support designed specifically for healthcare environments.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <p>Emergency IT Support</p>
                <p className="font-semibold text-white">Extension: 911</p>
                <p>Available 24/7 for critical issues</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency</span>
                  <span className="text-red-400">24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hospital IT Help Desk. All rights reserved. HIPAA Compliant.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
