"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  _id: string;
  url: string;
  public_id: string;
  createdAt?: string;
}

export default function GalleriesPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Modal navigation handlers
  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };
  const goToNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, currentIndex, images.length]);

  const handleDelete = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      const response = await fetch(`/api/images?id=${encodeURIComponent(publicId)}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete image');
      
      setImages(prev => prev.filter(img => img.public_id !== publicId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-light mb-4">OUR GALLERIES</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Loading your beautiful images...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-light mb-4">OUR GALLERIES</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-light mb-4">OUR GALLERIES</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our diverse collection of photography showcasing beautiful moments
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No images found in the gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((image, idx) => (
            <div
              key={image._id}
              className="relative group cursor-pointer"
              onClick={() => openModal(idx)}
            >
              <div className="aspect-square overflow-hidden rounded-lg shadow-md">
                <Image
                  src={image.url}
                  alt={`Gallery image ${image.public_id}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {/* <button
                  onClick={() => handleDelete(image.public_id)}
                  className="ml-auto bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  aria-label="Delete image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && images[currentIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-3xl h-full max-h-[90vh] flex items-center justify-center">
            <Image
              src={images[currentIndex].url}
              alt={`Gallery image ${images[currentIndex].public_id}`}
              fill
              className="object-contain"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={goToPrev}
                className="p-2 text-white hover:text-gray-300 transition-colors bg-black/30 rounded-full"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={goToNext}
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
      )}
    </div>
  );
}