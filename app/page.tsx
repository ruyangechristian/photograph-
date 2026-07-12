import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { About } from "@/components/about"
import { BookSession } from "@/components/book-session"
import { Partner } from "@/components/partner"
import { ContactFooter } from "@/components/contact-footer"

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Portfolio />
      <About />
      <BookSession />
      <Partner />
      <ContactFooter />
    </main>
  )
}
