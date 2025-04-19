import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getGalleryData(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/albums/${id}`)
    if (!res.ok) throw new Error('Failed to fetch gallery')
    const album = await res.json()
    
    return {
      title: album.title,
      description: "Beautiful moments captured", // Add description to your album model if needed
      date: album.date,
      location: "Various Venues", // Add location to your album model if needed
      images: album.images.map((img: any, index: number) => ({
        id: index + 1,
        src: img.url,
        alt: `${album.title} - Image ${index + 1}`
      }))
    }
  } catch (error) {
    console.error('Error fetching gallery:', error)
    // Fallback to your original hardcoded data
    const fallbackGalleries = {
      "1": {
        title: "Wedding Ceremonies",
        description: "Beautiful moments from wedding ceremonies",
        date: "2023",
        location: "Various Venues",
        images: [
          { id: 1, src: "/images/wildlife-monkey1.png", alt: "Wedding ceremony example" },
          { id: 2, src: "/images/wildlife-monkey2.png", alt: "Wedding ceremony example" },
          // ... other fallback images
        ]
      },
      // ... other fallback galleries
    }
    return fallbackGalleries[id as keyof typeof fallbackGalleries] || fallbackGalleries["1"]
  }
}

export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
  const gallery = await getGalleryData(params.id)

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <Link href="/galleries" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Galleries
      </Link>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-light mb-4">{gallery.title}</h1>
        <p className="text-gray-600 mb-4">{gallery.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Year: {gallery.date}</span>
          <span>Location: {gallery.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images.map((image: any) => (
          <div
            key={image.id}
            className="group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-light mb-6">Interested in booking your wedding?</h2>
        <Link href="/contact">
          <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300">
            CONTACT US
          </button>
        </Link>
      </div>
    </div>
  )
}