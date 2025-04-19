import { Schema, model, models } from 'mongoose'

interface Image {
  url: string
  public_id: string
}

const AlbumSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  coverImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
})

const Album = models.Album || model('Album', AlbumSchema)

export default Album