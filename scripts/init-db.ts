import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'photograph-website'

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(DATABASE_URL, {
      dbName: DB_NAME,
    })
    console.log('✅ Connected to MongoDB')

    // Define User schema inline
    const userSchema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    })

    const User = mongoose.models.User || mongoose.model('User', userSchema)

    // Create default admin user
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

    const existingUser = await User.findOne({ username: ADMIN_USERNAME })
    if (existingUser) {
      console.log(`✅ User '${ADMIN_USERNAME}' already exists`)
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
      const user = new User({
        username: ADMIN_USERNAME,
        password: hashedPassword,
        email: 'admin@example.com',
      })
      await user.save()
      console.log(`✅ Created default admin user: '${ADMIN_USERNAME}'`)
      console.log(`⚠️  Default password is: '${ADMIN_PASSWORD}' (Please change this!)`)
    }

    console.log('✅ Database initialization complete')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

initializeDatabase()
