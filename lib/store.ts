import postgres from 'postgres'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const sql = postgres(DATABASE_URL, {
  prepare: true,
  ssl: 'require',
})

let initialized = false

async function init(): Promise<void> {
  if (initialized) return
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail TEXT,
      created_at TEXT NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      session_type TEXT NOT NULL,
      date TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    )
  `
  initialized = true
}

export interface MediaItem {
  id?: string
  title: string
  category: 'event' | 'documentary' | 'video'
  type: 'photo' | 'video'
  url: string
  thumbnail?: string
  createdAt: string
}

export interface Booking {
  id?: string
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  message: string
  createdAt: string
}

export interface SessionDoc {
  id: string
  createdAt: string
}

export async function getMedia(): Promise<MediaItem[]> {
  await init()
  const rows = await sql`
    SELECT id, title, category, type, url, thumbnail, created_at
    FROM media
    ORDER BY created_at DESC
  `
  return rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    category: row.category as MediaItem['category'],
    type: row.type as MediaItem['type'],
    url: row.url,
    thumbnail: row.thumbnail,
    createdAt: row.created_at,
  }))
}

export async function setMedia(items: MediaItem[]): Promise<void> {
  await init()
  await sql`DELETE FROM media`
  if (items.length > 0) {
    const values = items.map((item) => [
      item.id || Date.now().toString(),
      item.title,
      item.category,
      item.type,
      item.url,
      item.thumbnail || null,
      item.createdAt,
    ])
    await sql`
      INSERT INTO media (id, title, category, type, url, thumbnail, created_at)
      VALUES ${sql(values as any)}
    `
  }
}

export async function getBookings(): Promise<Booking[]> {
  await init()
  const rows = await sql`
    SELECT id, name, email, phone, session_type, date, message, created_at
    FROM bookings
    ORDER BY created_at DESC
  `
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    sessionType: row.session_type,
    date: row.date,
    message: row.message,
    createdAt: row.created_at,
  }))
}

export async function setBookings(items: Booking[]): Promise<void> {
  await init()
  await sql`DELETE FROM bookings`
  if (items.length > 0) {
    const values = items.map((item) => [
      item.id || Date.now().toString(),
      item.name,
      item.email,
      item.phone,
      item.sessionType,
      item.date,
      item.message || '',
      item.createdAt,
    ])
    await sql`
      INSERT INTO bookings (id, name, email, phone, session_type, date, message, created_at)
      VALUES ${sql(values as any)}
    `
  }
}

export async function getSessions(): Promise<SessionDoc[]> {
  await init()
  const rows = await sql`
    SELECT id, created_at
    FROM sessions
  `
  return rows.map((row: any) => ({
    id: row.id,
    createdAt: row.created_at,
  }))
}

export async function saveSessions(sessions: SessionDoc[]): Promise<void> {
  await init()
  await sql`DELETE FROM sessions`
  if (sessions.length > 0) {
    const values = sessions.map((s) => [s.id, s.createdAt])
    await sql`
      INSERT INTO sessions (id, created_at)
      VALUES ${sql(values as any)}
    `
  }
}
