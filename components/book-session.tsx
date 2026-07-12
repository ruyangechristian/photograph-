"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const sessionTypes = ["Event", "Documentary", "Wedding", "Portrait", "Video / Film", "Other"]

export function BookSession() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    sessionType: sessionTypes[0],
    date: "",
    message: "",
  })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', message: 'Booking submitted successfully! We will contact you soon.' })
        setForm({ name: "", email: "", phone: "", sessionType: sessionTypes[0], date: "", message: "" })
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"

  return (
    <section id="book" className="bg-black py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-primary">Book Session</p>
          <h2 className="font-heading text-3xl font-bold text-white text-balance md:text-4xl">
            Let's create something memorable
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">
            Share a few details and we'll get back to you to confirm your session.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl bg-white p-6 shadow-2xl md:p-8"
        >
          {status && (
            <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${status.type === 'success' ? 'bg-gray-100 text-black' : 'bg-black text-white'}`}>
              {status.message}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                Name
              </label>
              <input id="name" required value={form.name} onChange={update("name")} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                Phone Number
              </label>
              <input id="phone" type="tel" value={form.phone} onChange={update("phone")} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-foreground">
                Type of Session
              </label>
              <select id="type" value={form.sessionType} onChange={update("sessionType")} className={fieldClass}>
                {sessionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-foreground">
                Preferred Date
              </label>
              <input id="date" type="date" value={form.date} onChange={update("date")} className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={update("message")}
                className={`${fieldClass} resize-none`}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Booking'}
          </Button>
        </form>
      </div>
    </section>
  )
}
