'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          window.location.href = '/admin'
        }
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      window.location.href = '/admin'
    } else {
      setError(data.error || 'Login failed')
    }
  }

   return (
     <div className="flex min-h-screen items-center justify-center bg-black">
       <div className="w-full max-w-sm rounded-3xl bg-black p-8 shadow-2xl border border-white/10">
         <div className="text-center">
           <h1 className="font-heading text-3xl font-bold text-white">Admin Login</h1>
           <p className="mt-2 text-sm text-white/60">Iremefocus Backend</p>
         </div>
         <form onSubmit={handleSubmit} className="mt-8 space-y-5">
           <div>
             <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-white">
               Username
             </label>
             <input
               id="username"
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               required
               className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
             />
           </div>
           <div>
             <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white">
               Password
             </label>
             <input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
             />
           </div>
           {error && <p className="text-sm text-destructive">{error}</p>}
           <Button
             type="submit"
             size="lg"
             className="w-full rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
             disabled={loading}
           >
             {loading ? 'Signing in...' : 'Sign In'}
           </Button>
         </form>
       </div>
     </div>
   )
}
