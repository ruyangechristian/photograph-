// app/dashboard/layout.tsx
"use client"
import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, GalleryHorizontal, Mail } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear authentication tokens
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem("isAuthenticated")
    
    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col px-4 py-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">IREMEFOCUS</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard" className="hover:bg-gray-800 px-3 py-2 rounded-md flex items-center gap-2">
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/dashboard/albums" className="hover:bg-gray-800 px-3 py-2 rounded-md flex items-center gap-2">
            <GalleryHorizontal size={18} /> Albums
          </Link>
          <Link href="/dashboard/gallery" className="hover:bg-gray-800 px-3 py-2 rounded-md flex items-center gap-2">
            <Mail size={18} /> Managing Gallery
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">Hello, Admin</span>
            <button 
              onClick={handleLogout}
              className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}