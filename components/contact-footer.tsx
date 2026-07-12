import { Mail, Camera, Phone, AtSign, Share2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const PRIMARY_EMAIL = "iremefocus@gmail.com"
const SECONDARY_EMAIL = "mohamednd044@gmail.com"
const PHONE_DISPLAY = "0785 973 988"
const PHONE_HREF = "+250785973988"

export function ContactFooter() {
  return (
    <footer id="contact" className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-white">Contact</p>
          <h2 className="font-heading text-3xl font-bold text-balance md:text-4xl">Get in touch with Iremefocus</h2>
          <p className="mt-4 text-white/70">
            Ready to book or have a question? Reach out by email or phone and we&apos;ll respond within 24 hours.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <ContactCard icon={<Mail className="h-5 w-5" />} label="Email us" value={PRIMARY_EMAIL} href={`mailto:${PRIMARY_EMAIL}`} />
            <ContactCard icon={<Mail className="h-5 w-5" />} label="Founder" value={SECONDARY_EMAIL} href={`mailto:${SECONDARY_EMAIL}`} />
            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              label="Call or WhatsApp"
              value={PHONE_DISPLAY}
              href={`tel:${PHONE_HREF}`}
              className="sm:col-span-2"
            />
          </div>

          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-8 text-base font-semibold text-black hover:bg-white/90"
            >
              <a href={`mailto:${PRIMARY_EMAIL}`}>Email to Book</a>
            </Button>
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <SocialLink href="#" label="Instagram">
              <AtSign className="h-5 w-5" />
            </SocialLink>
            <SocialLink href="#" label="Share">
              <Share2 className="h-5 w-5" />
            </SocialLink>
            <SocialLink href="#" label="YouTube">
              <Play className="h-5 w-5" />
            </SocialLink>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" aria-hidden="true" />
            <span className="font-heading font-bold">
              Iremefocus
            </span>
          </div>
          <p className="text-sm text-white/60">© {new Date().getFullYear()} Iremefocus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function ContactCard({
  icon,
  label,
  value,
  href,
  className = "",
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  className?: string
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-white p-5 text-left transition-colors hover:border-black hover:bg-gray-50 ${className}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wide text-gray-500">{label}</span>
        <span className="block truncate font-medium text-black">{value}</span>
      </span>
    </a>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
    >
      {children}
    </a>
  )
}
