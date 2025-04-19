import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createHash } from "crypto"
import prisma from "./prisma"

// Simple password hashing function
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Check if the credentials are valid
export async function validateCredentials(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return false

  const hashedPassword = hashPassword(password)
  return user.password === hashedPassword
}

// Set a session cookie
export function setSession(username: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  cookies().set("session", username, { expires, httpOnly: true, path: "/" })
}

// Get the current session
export function getSession() {
  return cookies().get("session")?.value
}

// Clear the session
export function clearSession() {
  cookies().delete("session")
}

// Check if the user is authenticated
export async function isAuthenticated() {
  const session = getSession()
  if (!session) return false

  const user = await prisma.user.findUnique({
    where: { username: session },
  })

  return !!user
}

// Middleware to protect routes
export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect("/admin/login")
  }
}
