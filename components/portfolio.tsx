"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Play, X } from "lucide-react"

type MediaItem = {
  id: string
  title: string
  category: "event" | "documentary" | "video"
  type: "photo" | "video"
  url: string
  thumbnail?: string
  createdAt: string
}

type Photo = {
  src: string
  alt: string
}

type Video = {
  thumb: string
  title: string
  channel: string
  href: string
}

const tabs = ["Events", "Documentary", "Videos"] as const
type Tab = (typeof tabs)[number]

export function Portfolio() {
  const [tab, setTab] = useState<Tab>("Events")
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/media/public")
      .then((r) => r.ok ? r.json() : [])
      .then((data: MediaItem[]) => setMedia(data))
      .finally(() => setLoading(false))
  }, [])

type Video = {
  thumb: string
  title: string
  channel: string
  href: string
  embedUrl?: string
}

function parseYouTube(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : undefined
}

  const eventPhotos = media
    .filter((m) => m.type === "photo" && m.category === "event")
    .map((m) => ({ src: m.url, alt: m.title }))

  const documentaryPhotos = media
    .filter((m) => m.type === "photo" && m.category === "documentary")
    .map((m) => ({ src: m.url, alt: m.title }))

  const videos = media
    .filter((m) => m.type === "video")
    .map((m) => {
      const isYoutube = /youtube\.com\/watch\?v=|youtu\.be\//.test(m.url)
      const videoIdMatch = m.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      const ytThumb = videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : ""
      return {
        thumb: isYoutube && ytThumb ? ytThumb : m.thumbnail || m.url,
        title: m.title,
        channel: "Iremefocus",
        href: m.url.startsWith("http") ? m.url : `https://${m.url}`,
        embedUrl: isYoutube ? `https://www.youtube.com/embed/${videoIdMatch?.[1]}` : undefined,
      }
    })

  const activePhotos = tab === "Events" ? eventPhotos : tab === "Documentary" ? documentaryPhotos : []

  if (loading) {
    return (
      <section id="portfolio" className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-primary">Our Work</p>
            <h2 className="font-heading text-4xl font-bold text-foreground text-balance md:text-5xl">Our Portfolio</h2>
          </div>
          <p className="mt-10 text-center text-muted-foreground">Loading portfolio...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-black">Our Work</p>
          <h2 className="font-heading text-4xl font-bold text-black text-balance md:text-5xl">Our Portfolio</h2>
        </div>

        {/* Events / Documentary / Videos toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-black bg-white p-1.5 shadow-sm">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors md:px-8 ${
                  tab === t ? "bg-black text-white" : "text-black/70 hover:text-black"
                }`}
                aria-pressed={tab === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab !== "Videos" && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activePhotos.length === 0 && (
              <p className="col-span-full text-center text-gray-500">No photos in this category yet.</p>
            )}
            {activePhotos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setLightbox(p)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <Image
                  src={p.src || "/placeholder.svg"}
                  alt={p.alt}
                  fill
                  loading={i < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                  {tab}
                </span>
              </button>
            ))}
          </div>
        )}

        {tab === "Videos" && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.length === 0 && (
              <p className="col-span-full text-center text-gray-500">No videos yet.</p>
            )}
              {videos.map((v, i) => (
                <div
                  key={v.href + v.title}
                  className="group relative aspect-video overflow-hidden rounded-2xl bg-black"
                >
                  {v.embedUrl ? (
                    <iframe
                      src={v.embedUrl}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <a
                      href={v.href}
                      className="absolute inset-0"
                    >
                      <Image
                        src={v.thumb || "/placeholder.svg"}
                        alt={v.title}
                        fill
                        loading={i < 3 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                      />
                    </a>
                  )}
                  {!v.embedUrl && (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />
                      <span className="absolute left-4 top-4 z-10">
                        <span className="block font-heading text-base font-bold leading-tight text-white">
                          {v.title}
                        </span>
                        <span className="text-xs text-white/70">{v.channel}</span>
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform group-hover:scale-110">
                          <Play className="ml-0.5 h-6 w-6 fill-current" />
                        </span>
                      </span>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-white hover:text-primary"
            aria-label="Close preview"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox.src || "/placeholder.svg"} alt={lightbox.alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </section>
  )
}
