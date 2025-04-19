import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Types
type Image = {
  id: number
  src: string
  alt: string
}

type GalleryData = {
  title: string
  description: string
  date: string
  location: string
  images: Image[]
}

// Constants
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://www.iremefocus.com'
  : 'http://localhost:3000'

const FALLBACK_GALLERIES: Record<string, GalleryData> = {
  "1": {
    title: "Wedding Ceremonies",
    description: "Beautiful moments from wedding ceremonies",
    date: "2023",
    location: "Various Venues",
    images: [
      { 
        id: 1, 
        src: "/images/wildlife-monkey1.png", 
        alt: "Wedding ceremony example" 
      },
      { 
        id: 2, 
        src: "/images/wildlife-monkey2.png", 
        alt: "Wedding ceremony example" 
      },
    ]
  }
}

// API Functions
async function fetchGalleryData(id: string): Promise<GalleryData> {
  try {
    const res = await fetch(`${BASE_URL}/api/albums/${id}`)
    
    if (!res.ok) {
      throw new Error(`Failed to fetch gallery: ${res.status} ${res.statusText}`)
    }
    
    const album = await res.json()
    
    return {
      title: album.title,
      description: album.description || "Beautiful moments captured",
      date: album.date,
      location: album.location || "Various Venues",
      images: album.images.map((img: any, index: number) => ({
        id: index + 1,
        src: img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`,
        alt: img.alt || `${album.title} - Image ${index + 1}`
      }))
    }
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return FALLBACK_GALLERIES[id] || FALLBACK_GALLERIES["1"]
  }
}

// Components
function BackButton() {
  return (
    <Link 
      href="/galleries" 
      className="inline-flex items-center text-gray-600 hover:text-black mb-8"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Galleries
    </Link>
  )
}

function GalleryHeader({ title, description, date, location }: Omit<GalleryData, 'images'>) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl md:text-4xl font-light mb-4">{title}</h1>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Year: {date}</span>
        <span>Location: {location}</span>
      </div>
    </div>
  )
}

function GalleryImage({ image }: { image: Image }) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>
    </div>
  )
}

function CTA() {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-light mb-6">Interested in booking your wedding?</h2>
      <Link href="/contact">
        <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300">
          CONTACT US
        </button>
      </Link>
    </div>
  )
}

// Main Component
export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
  const gallery = await fetchGalleryData(params.id)

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <BackButton />
      <GalleryHeader {...gallery} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images.map((image) => (
          <GalleryImage key={image.id} image={image} />
        ))}
      </div>

      <CTA />
    </div>
  )
}