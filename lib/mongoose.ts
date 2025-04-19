import mongoose from 'mongoose'

const DATABASE_URL = process.env.DATABASE_URL
const DB_NAME = process.env.DB_NAME || 'photograph-website'

// Validate environment variables with proper type checking
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined')
}
if (!DB_NAME) {
  throw new Error('DB_NAME environment variable is not defined')
}

// Ensure DATABASE_URL is treated as string after validation
const connectionString: string = DATABASE_URL
const databaseName: string = DB_NAME

interface MongooseGlobal {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseGlobal | undefined
}

const globalForMongoose = global as typeof globalThis & { mongoose?: MongooseGlobal }

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = { conn: null, promise: null }
}

const cached = globalForMongoose.mongoose

async function connectToDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('Using existing MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection')
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: databaseName
    }

    cached.promise = mongoose.connect(connectionString, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully to database:', databaseName)
        return mongoose
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err)
        cached.promise = null
        throw err
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    console.error('Failed to establish MongoDB connection:', e)
    cached.promise = null
    throw e
  }
}

export default connectToDB