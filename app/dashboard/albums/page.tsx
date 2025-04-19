'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Upload, X, Check, Image, Loader2, Trash2, Edit } from 'lucide-react'

type ImageType = {
  url: string
  public_id?: string // Optional for backward compatibility
}

type Album = {
  _id: string
  title: string
  date: string
  coverImage: ImageType
  images: ImageType[]
  createdAt: string
}

export default function AlbumsPage() {
  const router = useRouter()
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)

  // Form state
  const [form, setForm] = useState({
    title: '',
    date: '',
    coverImage: null as File | null,
    images: [] as File[],
  })
  const [coverPreview, setCoverPreview] = useState('')
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])

  // Fetch albums
  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/albums')
      if (!res.ok) throw new Error('Failed to fetch albums')
      const data = await res.json()
      setAlbums(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load albums')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlbums()
  }, [fetchAlbums])

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, coverImage: file }))
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      setForm(prev => ({ ...prev, images: files }))
      setImagesPreviews(files.map(file => URL.createObjectURL(file)))
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      date: '',
      coverImage: null,
      images: [],
    })
    setCoverPreview('')
    setImagesPreviews([])
    setEditingAlbum(null)
  }

  // Handle form submission
  // Handle form submission - Updated to include ID for edits
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('date', form.date)
      if (editingAlbum) formData.append('id', editingAlbum._id)
      if (form.coverImage) formData.append('coverImage', form.coverImage)
      form.images.forEach(image => formData.append('images', image))

      const url = editingAlbum ? '/api/albums' : '/api/albums'
      const method = editingAlbum ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || (editingAlbum ? 'Failed to update album' : 'Failed to create album'))
      }

      await fetchAlbums()
      setShowCreateForm(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return

    try {
      setLoading(true)
      const res = await fetch(`/api/albums?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete album')
      }

      await fetchAlbums()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete album')
    } finally {
      setLoading(false)
    }
  }
  // Handle edit
  const handleEdit = (album: Album) => {
    setEditingAlbum(album)
    setForm({
      title: album.title,
      date: album.date,
      coverImage: null,
      images: [],
    })
    setCoverPreview(album.coverImage.url)
    setImagesPreviews(album.images.map(img => img.url))
    setShowCreateForm(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Albums</h1>
        <button
          onClick={() => {
            resetForm()
            setShowCreateForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          Create New Album
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <X className="mr-2" size={18} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingAlbum ? 'Edit Album' : 'Create New Album'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Date</label>
              <input
                type="text"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Cover Image</label>
              {coverPreview ? (
                <div className="relative mb-4 group">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, coverImage: null }))
                      setCoverPreview('')
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    aria-label="Remove cover image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    name="coverImage"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="cover-upload"
                    accept="image/*"
                    required={!editingAlbum}
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload cover image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  </label>
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Album Images <span className="text-gray-500 text-sm">(Select multiple)</span>
              </label>
              {imagesPreviews.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {imagesPreviews.map((preview, index) => (
                      <div key={`preview-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...form.images]
                            newImages.splice(index, 1)
                            setForm(prev => ({ ...prev, images: newImages }))
                            setImagesPreviews(prev => {
                              const newPreviews = [...prev]
                              newPreviews.splice(index, 1)
                              return newPreviews
                            })
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50">
                    <input
                      type="file"
                      name="images"
                      onChange={handleImagesChange}
                      className="hidden"
                      id="images-upload"
                      accept="image/*"
                      multiple
                    />
                    <label htmlFor="images-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">Add more images</p>
                    </label>
                  </div>
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    name="images"
                    onChange={handleImagesChange}
                    className="hidden"
                    id="images-upload"
                    accept="image/*"
                    multiple
                    required={!editingAlbum}
                  />
                  <label htmlFor="images-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload multiple images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
                  </label>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  resetForm()
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={18} />
                    {editingAlbum ? 'Updating...' : 'Creating...'}
                  </span>
                ) : editingAlbum ? (
                  'Update Album'
                ) : (
                  'Create Album'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showCreateForm ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16">
          <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No albums yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new album.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Camera className="-ml-1 mr-2 h-5 w-5" />
              New Album
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map(album => (
            <div key={album._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200 group">
                <img
                  src={album.coverImage.url}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white font-medium">
                    {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{album.title}</h3>
                    <p className="text-gray-600 text-sm">{album.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(album)}
                      className="text-blue-600 hover:text-blue-800 transition p-1 rounded-full hover:bg-blue-50"
                      aria-label="Edit album"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(album._id)}
                      className="text-red-600 hover:text-red-800 transition p-1 rounded-full hover:bg-red-50"
                      aria-label="Delete album"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}