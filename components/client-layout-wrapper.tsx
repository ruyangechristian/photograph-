'use client'

import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import Footer from "./footer"

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  )
}
