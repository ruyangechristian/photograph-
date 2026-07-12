import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Landing image (4.jpeg) */}
      <Image
        src="/hero.jpg"
        alt="Iremefocus capturing a panel discussion event on stage"
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white">
          Event · Documentary · Video
        </p>
        <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 font-heading text-4xl font-bold leading-tight text-balance sm:text-6xl md:text-7xl">
          Iremefocus
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 mx-auto mt-5 max-w-xl text-lg text-white/90 text-pretty md:text-xl">
          Capturing Moments, Creating Memories.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full rounded-full bg-white px-8 text-base font-semibold text-black transition-transform hover:scale-[1.03] hover:bg-white/90 sm:w-auto"
          >
            <a href="#book">Book a Session</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full rounded-full border-white/40 bg-transparent px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <a href="#portfolio">
              <Play className="mr-2 h-5 w-5" />
              View Portfolio
            </a>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  )
}
