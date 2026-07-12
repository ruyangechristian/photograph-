import Image from "next/image"
import { Aperture, Heart, Eye } from "lucide-react"

export function About() {
  return (
    <section id="about" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/ceo.jpg"
              alt="Mohamed, Founder & CEO of Iremefocus"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-black px-6 py-5 text-white shadow-xl sm:block">
            <p className="font-heading text-xl font-bold leading-tight">Mohamed</p>
            <p className="text-sm font-medium">Founder & CEO</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-black">About Us</p>
          <h2 className="font-heading text-3xl font-bold text-black text-balance md:text-4xl">
            Every frame tells a story worth remembering
          </h2>
          <p className="mt-5 leading-relaxed text-gray-600">
            Iremefocus is a premium visual studio led by our founder Mohamed, specializing in event and
            documentary photography alongside cinematic video. What began as a passion for capturing genuine
            human moments has grown into a studio trusted by brands, organizations, and families across the
            region.
          </p>
          <p className="mt-4 leading-relaxed text-gray-600">
            We blend technical precision with an artist&apos;s eye, delivering fast turnaround and gallery-grade
            quality on every shoot. When you work with Iremefocus, you&apos;re not just booking a photographer —
            you&apos;re trusting a team dedicated to preserving the moments that matter most.
          </p>

          <div className="mt-8 space-y-5">
            <Feature
              icon={<Aperture className="h-5 w-5" />}
              title="Who we are"
              text="A dedicated team of photographers and filmmakers passionate about authentic, timeless imagery."
            />
            <Feature
              icon={<Heart className="h-5 w-5" />}
              title="Our mission"
              text="To capture genuine emotion and craft visuals that clients treasure for a lifetime."
            />
            <Feature
              icon={<Eye className="h-5 w-5" />}
              title="Our vision"
              text="To be the region's most trusted name in premium event and documentary storytelling."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-black">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{text}</p>
      </div>
    </div>
  )
}
