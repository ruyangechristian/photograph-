"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";

// Types
type Image = {
  id: number;
  src: string;
  alt: string;
};

type GalleryData = {
  title: string;
  description: string;
  date: string;
  location: string;
  images: Image[];
};

// Constants
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
};

// Components
function BackButton() {
  return (
    <Link 
      href="/galleries" 
      className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Galleries
    </Link>
  );
}

function GalleryHeader({ title, description, date, location }: Omit<GalleryData, 'images'>) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl md:text-4xl font-light mb-4">{title}</h1>
      <p className="text-gray-600 mb-4 max-w-3xl">{description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Year: {date}</span>
        <span>Location: {location}</span>
      </div>
    </div>
  );
}

function ImageModal({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}: {
  images: Image[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="relative w-full max-w-6xl h-full max-h-[90vh]">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          className="object-contain"
          priority
        />
        
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button 
            onClick={onPrev}
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black/30 rounded-full"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={onNext}
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black/30 rounded-full"
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

function GalleryImage({ 
  image,
  onClick 
}: { 
  image: Image;
  onClick: () => void;
}) {
  return (
    <div 
      className="group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      onClick={onClick}
    >
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
  );
}

function CTA() {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-light mb-6">Interested in booking your wedding?</h2>
      <Link href="/contact">
        <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300 rounded-lg">
          CONTACT US
        </button>
      </Link>
    </div>
  );
}

// Main Component
export default function GalleryDetailPage() {
  const params = useParams();
  const [gallery, setGallery] = useState<GalleryData>(FALLBACK_GALLERIES["1"]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/albums/${params.id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch gallery: ${res.status} ${res.statusText}`);
        }
        
        const album = await res.json();
        
        setGallery({
          title: album.title,
          description: album.description || "Beautiful moments captured",
          date: album.date,
          location: album.location || "Various Venues",
          images: album.images.map((img: any, index: number) => ({
            id: index + 1,
            src: img.url.startsWith('http') ? img.url : img.url,
            alt: img.alt || `${album.title} - Image ${index + 1}`
          }))
        });
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setGallery(FALLBACK_GALLERIES[params.id as string] || FALLBACK_GALLERIES["1"]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const goToNext = () => {
    if (currentImageIndex < gallery.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          goToPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, currentImageIndex, gallery.images.length]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <BackButton />
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <BackButton />
      <GalleryHeader {...gallery} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images.map((image, index) => (
          <GalleryImage 
            key={image.id} 
            image={image} 
            onClick={() => openModal(index)}
          />
        ))}
      </div>

      <CTA />

      {modalOpen && (
        <ImageModal
          images={gallery.images}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onNext={goToNext}
          onPrev={goToPrev}
        />
      )}
    </div>
  );
}