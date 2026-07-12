"use client"

import type React from "react"
import { useState } from "react"
import { Building2, CalendarCheck, Handshake, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const benefits = [
  { icon: <Building2 className="h-5 w-5" />, title: "For Brands", text: "Elevate your brand with premium visual content that converts." },
  { icon: <CalendarCheck className="h-5 w-5" />, title: "For Event Organizers", text: "Full-scale coverage that captures every highlight of your event." },
  { icon: <TrendingUp className="h-5 w-5" />, title: "For Businesses", text: "Consistent, on-brand imagery for marketing and social media." },
  { icon: <Handshake className="h-5 w-5" />, title: "Long-term Value", text: "Flexible retainer packages built around your goals." },
]

const PARTNER_EMAIL = "iremefocus@gmail.com"

export function Partner() {
  const [form, setForm] = useState({ company: "", email: "", details: "" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Partnership Inquiry — ${form.company || "New Partner"}`)
    const body = encodeURIComponent(
      `Company: ${form.company}\nEmail: ${form.email}\n\nDetails:\n${form.details}`,
    )
    window.location.href = `mailto:${PARTNER_EMAIL}?subject=${subject}&body=${body}`
  }

  const fieldClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"

  return (
    <section id="partner" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-black">Partner With Us</p>
          <h2 className="font-heading text-3xl font-bold text-black text-balance md:text-4xl">
            Collaborate with Iremefocus
          </h2>
          <p className="mt-5 leading-relaxed text-gray-600">
            We partner with brands, event organizers, and businesses to deliver standout visual storytelling.
            Whether it&apos;s a one-off campaign or an ongoing collaboration, we tailor every engagement to your
            objectives.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-black bg-black p-5 text-white">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-white">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{b.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <form onSubmit={handleSubmit} className="w-full rounded-3xl bg-gray-100 p-6 md:p-8">
            <h3 className="font-heading text-xl font-bold text-black">Partnership inquiry</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-black">
                  Company / Organization
                </label>
                <input
                  id="company"
                  required
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="partner-email" className="mb-1.5 block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  id="partner-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="details" className="mb-1.5 block text-sm font-medium text-black">
                  Tell us about your project
                </label>
                <textarea
                  id="details"
                  rows={4}
                  value={form.details}
                  onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                  className={`${fieldClass} resize-none`}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full rounded-full bg-black text-white text-base font-semibold hover:bg-black/90"
            >
              Send Inquiry
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
