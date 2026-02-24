import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import connectToDB from "./mongoose"
import User from "@/models/user.model"

const SALT_ROUNDS = 10

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Check if the credentials are valid
export async function validateCredentials(username: string, password: string) {
  try {
    await connectToDB()
    const user = await User.findOne({ username }).select("+password")

    if (!user) return false

    const isValid = await comparePassword(password, user.password)
    return isValid
  } catch (error) {
    console.error("Error validating credentials:", error)
    return false
  }
}

// Set a session cookie
export async function setSession(username: string) {
  const cookieStore = await cookies()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  cookieStore.set("session", username, { 
    expires, 
    httpOnly: true, 
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })
}

// Get the current session
export async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get("session")?.value
}

// Clear the session
export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

// Check if the user is authenticated
export async function isAuthenticated() {
  try {
    const session = await getSession()
    if (!session) return false

    await connectToDB()
    const user = await User.findOne({ username: session })

    return !!user
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

// Middleware to protect routes
export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect("/login")
  }
}

// Create a new user (for admin setup)
export async function createUser(username: string, password: string, email?: string) {
  try {
    await connectToDB()
    
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      throw new Error("User already exists")
    }

    const hashedPassword = await hashPassword(password)
    const user = new User({
      username,
      password: hashedPassword,
      email,
    })

    await user.save()
    return { success: true, message: "User created successfully" }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
