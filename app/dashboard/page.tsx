// app/dashboard/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Image as ImageIcon, Album, BarChart2, Calendar } from "lucide-react"

// Define interfaces for our data types
interface AlbumType {
  _id: string
  title: string
  date: string
  createdAt: string
  coverImage: {
    url: string
    public_id: string
  }
  images: Array<{ url: string, public_id: string }>
}

interface ImageType {
  _id: string
  url: string
  public_id: string
  createdAt?: string
}

export default function DashboardHome() {
  const [albumCount, setAlbumCount] = useState<number>(0)
  const [imageCount, setImageCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [latestUpload, setLatestUpload] = useState<string>('N/A')

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true)
      try {
        // Fetch albums
        const albumsResponse = await fetch('/api/albums')
        const albumsData = await albumsResponse.json() as AlbumType[]
        setAlbumCount(albumsData.length)
        
        // Find latest album date if there are albums
        if (albumsData.length > 0) {
          const sortedAlbums = [...albumsData].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          if (sortedAlbums[0]?.createdAt) {
            setLatestUpload(new Date(sortedAlbums[0].createdAt).toLocaleDateString())
          }
        }
        
        // Fetch images
        const imagesResponse = await fetch('/api/images')
        const imagesData = await imagesResponse.json() as ImageType[]
        setImageCount(imagesData.length)
      } catch (error) {
        console.error("Error fetching statistics:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStatistics()
  }, [])

  // Calculate estimated storage (assuming 2.5MB per media item)
  const estimatedStorage = ((albumCount + imageCount) * 2.5).toFixed(1)

  // Stats cards data
  const statsCards = [
    {
      title: "Total Albums",
      value: albumCount,
      icon: <Album size={24} className="text-gray-900" />,
      color: "bg-amber-100"
    },
    {
      title: "Total Images in Gallery",
      value: imageCount,
      icon: <ImageIcon size={24} className="text-gray-900" />,
      color: "bg-blue-100"
    },
    {
      title: "Latest Upload",
      value: latestUpload,
      icon: <Calendar size={24} className="text-gray-900" />,
      color: "bg-green-100" 
    },
    {
      title: "Storage Used",
      value: `${estimatedStorage} MB`,
      icon: <BarChart2 size={24} className="text-gray-900" />,
      color: "bg-purple-100"
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Statistics</h1>
        <p className="text-gray-300">
          Overview of your media collection
        </p>
      </div>
      
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-500">{stat.title}</h3>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Media Overview</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gray-900 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (albumCount / 50) * 100)}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-700">
                  {albumCount}/50 albums
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gray-900 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (imageCount / 200) * 100)}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-700">
                  {imageCount}/200 images
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}