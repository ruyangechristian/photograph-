import mongoose from 'mongoose'

export interface IImage extends mongoose.Document {
  public_id: string
  url: string
  createdAt: Date
}

const ImageSchema = new mongoose.Schema<IImage>({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema)