"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Validate credentials
      const isValidCredentials = 
        email.trim() === "iremefocus@gmail.com" &&
        password === "Iremefocus@!24"
      
      if (isValidCredentials) {
        // Set cookie (accessible in middleware)
        document.cookie = "isAuthenticated=true; path=/; max-age=86400" // 1 day
        
        // Optional: Also set localStorage for client-side checks
        localStorage.setItem("isAuthenticated", "true")
        
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-100 to-gray-950">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <LogIn className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-gray-900 hover:text-gray-700">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 ${
              isLoading ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'
            } text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium`}
          >
            <LogIn size={18} />
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-gray-900 hover:text-gray-700">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}