"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Album = {
  id: string | number;
  title: string;
  date: string;
  coverImage: string;
  images: number;
};

export default function Home() {
  const [showAll, setShowAll] = useState(false);
  const [eventAlbums, setEventAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAlbums = async (): Promise<Album[]> => {
      try {
        const res = await fetch('/api/albums?limit=4');
        if (!res.ok) throw new Error('Failed to fetch albums');
        const data = await res.json();
        return data.map((album: any) => ({
          id: album._id,
          title: album.title,
          date: album.date,
          coverImage: album.coverImage.url,
          images: album.images.length
        }));
      } catch (error) {
        console.error('Error fetching albums:', error);
        return [
          {
            id: 1,
            title: "Elegant Ceremonies",
            date: "2023",
            coverImage: "/images/wildlife-monkey1.png",
            images: 24,
          },
          // ... other fallback albums
        ];
      }
    };

    const fetchAlbums = async () => {
      const albums = await getAlbums();
      setEventAlbums(albums);
      setLoading(false);
    };
    
    fetchAlbums();
  }, []);

  const shouldShowToggle = eventAlbums.length > 4;
  const displayedAlbums = shouldShowToggle && !showAll 
    ? eventAlbums.slice(0, 4) 
    : eventAlbums;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <Image 
          src="/images/landscape-bridge.png" 
          alt="Photography example" 
          fill 
          priority 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white p-6 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-wider">
              CAPTURING SPECIAL MOMENTS
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto">
              Professional photography that tells your unique story
            </p>
            <Link href="/contact">
              <button className="mt-8 px-8 py-3 bg-white text-black hover:bg-gray-200 transition duration-300 flex items-center mx-auto">
                BOOK A SESSION
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-20 px-4 md:px-8 max-w-[2000px] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light mb-4">OUR PORTFOLIO</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of photography showcasing beautiful moments
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg aspect-[16/9] md:aspect-[21/9] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
              {displayedAlbums.map((album) => (
                <Link href={`/galleries/${album.id}`} key={album.id}>
                  <div className="group cursor-pointer overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                        <div className="p-6 md:p-10 w-full">
                          <h3 className="text-white text-2xl md:text-3xl font-medium">{album.title}</h3>
                          <div className="flex justify-between text-base md:text-lg text-white/80 mt-2">
                            <span>{album.date}</span>
                            <span>{album.images} photos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {shouldShowToggle && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  {showAll ? 'Show Less' : `Show All (${eventAlbums.length})`}
                </button>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-16">
          <Link href="/galleries">
            <button className="px-8 py-3 border border-black hover:bg-black hover:text-white transition duration-300 flex items-center mx-auto">
              VIEW ALL GALLERIES
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>


       {/* Testimonials with improved design */}
       <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-16">CLIENT TESTIMONIALS</h2>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <blockquote className="text-lg md:text-2xl font-light italic mb-8">
              "IREMEFOCUS captured our special day in a way I've never seen before. The images tell a story that words
              simply cannot express."
            </blockquote>
            <p className="text-gray-600">— Sarah & Michael</p>
          </div>
        </div>
      </section>

      {/* Call to Action with improved design */}
      <section className="w-full py-16 md:py-20 px-4 md:px-8 bg-gray-900 text-white">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10 max-w-7xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Contact Us</h2>
            <p className="max-w-[600px] text-gray-300 text-base md:text-xl/relaxed">
              Let's create beautiful memories together. Get in touch to discuss your photography needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 md:px-8 text-sm font-medium text-black shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Contact Us
            </Link>
            <Link
              href="/galleries"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-6 md:px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              View Galleries
            </Link>
          </div>
        </div>
      </section>


      {/* Rest of your existing sections remain unchanged */}
      {/* Testimonials and CTA sections... */}
    </div>
  );
}