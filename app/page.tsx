"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

type Album = {
  id: string | number;
  title: string;
  date: string;
  coverImage: string;
  images: number;
  category?: string;
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
          date: new Date(album.date).getFullYear().toString(),
          coverImage: album.coverImage.url,
          images: album.images.length,
          category: album.category || "Event"
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
            category: "Wedding"
          },
          {
            id: 2,
            title: "Wedding Bliss",
            date: "2023",
            coverImage: "/images/wedding-couple.png",
            images: 36,
            category: "Wedding"
          },
          {
            id: 3,
            title: "Corporate Events",
            date: "2023",
            coverImage: "/images/corporate-event.png",
            images: 18,
            category: "Corporate"
          },
          {
            id: 4,
            title: "Family Portraits",
            date: "2023",
            coverImage: "/images/family-portrait.png",
            images: 12,
            category: "Portrait"
          }
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <Image 
          src="/images/landscape-bridge.png" 
          alt="Photography example" 
          fill 
          priority 
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex items-center justify-center">
          <div className="text-center text-white p-6 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
              CAPTURING LIFE'S <span className="font-medium">BEAUTIFUL MOMENTS</span>
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8">
              Professional photography that tells your unique story with elegance and passion
            </p>
            <Link href="/contact">
              <button className="mt-4 px-8 py-4 bg-white text-black hover:bg-gray-100 transition-all duration-300 flex items-center mx-auto rounded-lg shadow-lg hover:shadow-xl group">
                <span className="font-medium tracking-wide">BOOK A SESSION</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-24 px-4 md:px-8 max-w-[2000px] mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-light mb-6">OUR PORTFOLIO</h2>
          <div className="w-24 h-1 bg-gray-300 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our collection of photography showcasing beautiful moments captured with precision and artistry
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-[4/5] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedAlbums.map((album, index) => (
                <Link 
                  href={`/galleries/${album.id}`} 
                  key={album.id} 
                  className="group relative block w-full h-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index < 4}
                      quality={90}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full text-xs font-medium tracking-wide shadow-sm">
                      {album.category}
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-all duration-500 group-hover:-translate-y-2">
                      <h3 className="text-2xl font-medium mb-1">{album.title}</h3>
                      <div className="flex justify-between items-center text-sm">
                        <span>{album.date}</span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                          </svg>
                          {album.images}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {shouldShowToggle && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-4 bg-black text-white hover:bg-gray-800 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {showAll ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <span>Show All ({eventAlbums.length})</span>
                      <ChevronDown className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-20">
          <Link href="/galleries">
            <button className="px-8 py-4 border-2 border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center mx-auto rounded-lg group shadow-sm hover:shadow-md">
              <span className="font-medium mr-3">EXPLORE FULL GALLERY</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light mb-6">CLIENT TESTIMONIALS</h2>
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Hear what our clients say about their experience working with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "IREMEFOCUS captured our wedding day perfectly. The photos tell our love story better than words ever could.",
                author: "Sarah & Michael",
                type: "Wedding"
              },
              {
                quote: "The corporate event photos were stunning and perfectly captured the essence of our brand. Professional and creative!",
                author: "James Wilson",
                type: "Corporate"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-start mb-6">
                  <div className="text-5xl font-serif text-gray-300 mr-4">"</div>
                  <blockquote className="text-lg font-light italic text-gray-700 flex-1">
                    {testimonial.quote}
                  </blockquote>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 font-medium">{testimonial.author}</p>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {testimonial.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-24 px-4 md:px-8 bg-black text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-light mb-6">Ready to Create Lasting Memories?</h2>
            <div className="w-24 h-1 bg-gray-400 mb-8"></div>
            <p className="text-gray-300 text-lg max-w-xl mb-8">
              Let's discuss how we can capture your special moments with our unique photographic style and expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-black hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <span className="mr-3">Get in Touch</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/info"
                className="inline-flex h-14 items-center justify-center rounded-lg border-2 border-white px-8 text-base font-medium text-white hover:bg-white/10 transition-all duration-300"
              >
                Learn About Us
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/top-view-photo-camera-indoors-still-life_23-2150630615.jpg"
              alt="Photographer at work"
              fill
              className="object-cover"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
          </div>
        </div>
      </section>
    </div>
  );
}