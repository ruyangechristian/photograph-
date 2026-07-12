'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

type Tab = 'media' | 'bookings'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('media')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [media, setMedia] = useState<{ id: string; title: string; category: string; type: string; url: string; createdAt: string }[]>([])
  const [bookings, setBookings] = useState<{ id: string; name: string; email: string; phone: string; sessionType: string; date: string; message: string; createdAt: string }[]>([])
  const [mediaForm, setMediaForm] = useState({ title: '', category: 'event', type: 'photo', url: '' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setAuthed(data.authenticated)
        if (!data.authenticated) {
          window.location.href = '/admin/login'
        } else {
          loadData()
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function loadData() {
    if (tab === 'media') {
      const res = await fetch('/api/media')
      if (res.ok) setMedia(await res.json())
    } else {
      const res = await fetch('/api/bookings')
      if (res.ok) setBookings(await res.json())
    }
  }

  useEffect(() => {
    if (authed) loadData()
  }, [tab, authed])

  function isYouTubeUrl(url: string) {
    return /youtube\.com\/watch\?v=|youtu\.be\//.test(url)
  }

  async function handleAddMedia(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...mediaForm }
    if (isYouTubeUrl(mediaForm.url)) {
      payload.type = 'video'
    }
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMediaForm({ title: '', category: 'event', type: 'photo', url: '' })
      loadData()
    }
    setSaving(false)
  }

  async function handleDeleteMedia(id: string) {
    await fetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadData()
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    const newMedia: { title: string; category: string; type: string; url: string; createdAt: string }[] = []
    for (const file of files) {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/media/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.url) {
        newMedia.push({
          title: data.filename || file.name,
          category: mediaForm.category,
          type: file.type.startsWith('video') ? 'video' : 'photo',
          url: data.url,
          createdAt: new Date().toISOString(),
        })
      }
    }
    setUploading(false)
    if (newMedia.length) {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media: newMedia }),
      })
      if (res.ok) {
        setMediaForm({ title: '', category: 'event', type: 'photo', url: '' })
        loadData()
      }
    }
  }

  async function handleDeleteBooking(id: string) {
    await fetch('/api/bookings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadData()
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.location.href = '/'}
              size="sm"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Back to Home
            </Button>
            <h1 className="font-heading text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <Button
            onClick={handleLogout}
            size="sm"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Logout
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="inline-flex rounded-full border border-white/10 bg-black p-1.5 shadow-sm">
          {(['media', 'bookings'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors md:px-8 ${
                tab === t ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:text-white'
              }`}
              aria-pressed={tab === t}
            >
              {t === 'media' ? 'Media' : 'Bookings'}
            </button>
          ))}
        </div>

        {tab === 'media' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-white/10 bg-black p-6 shadow-sm">
                <h2 className="font-heading text-lg font-bold text-white">Add Media</h2>
                <p className="mt-1 text-sm text-white/60">Add photos, documentaries, or videos.</p>
                <form onSubmit={handleAddMedia} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white">Title</label>
                    <input
                      value={mediaForm.title}
                      onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                      required
                      className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white">Category</label>
                    <select
                      value={mediaForm.category}
                      onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="event">Event</option>
                      <option value="documentary">Documentary</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white">Upload Photo / Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleUpload}
                      className="block w-full text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {uploading && <p className="mt-1 text-xs text-white/60">Uploading...</p>}
                    {mediaForm.url && !uploading && (
                      <p className="mt-1 truncate text-xs text-white/60">File: {mediaForm.url}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white">YouTube URL (for videos)</label>
                    <input
                      value={mediaForm.url.startsWith('/uploads/') ? '' : mediaForm.url}
                      onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-full" disabled={saving}>
                    {saving ? 'Saving...' : 'Add Media'}
                  </Button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Preview</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-900">
                     {media.length === 0 && (
                       <tr>
                         <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                           No media yet. Add your first item using the form.
                         </td>
                       </tr>
                     )}
                     {media.map((m) => (
                       <tr key={m.id} className="hover:bg-gray-50">
                         <td className="px-4 py-3 text-sm text-gray-900">{m.title}</td>
                         <td className="px-4 py-3 text-sm text-gray-900 capitalize">{m.category}</td>
                         <td className="px-4 py-3 text-sm text-gray-900 capitalize">{m.type}</td>
                         <td className="px-4 py-3 text-sm text-gray-900">
                           {m.type === 'photo' ? (
                             <img src={m.url} alt={m.title} className="h-10 w-16 rounded-lg object-cover" />
                           ) : (
                             <a href={m.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                               YouTube
                             </a>
                           )}
                         </td>
                         <td className="px-4 py-3 text-right text-sm">
                           <Button
                             variant="destructive"
                             size="sm"
                             className="rounded-full"
                             onClick={() => handleDeleteMedia(m.id)}
                           >
                             Delete
                           </Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Session Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">Booked At</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                        No bookings yet.
                      </td>
                    </tr>
                  )}
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{b.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.sessionType}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.date}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-900">{b.message}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(b.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleDeleteBooking(b.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
