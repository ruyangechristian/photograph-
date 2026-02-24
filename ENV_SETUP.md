# Environment Setup Guide

## Required Environment Variables

To make the image posting feature work, you need to set up the following environment variables:

### 1. MongoDB Connection
```
MONGODB_URI=your_mongodb_connection_string
```
Get this from MongoDB Atlas at https://cloud.mongodb.com

### 2. Cloudinary Configuration (REQUIRED for image uploading)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=albums
```

**How to get Cloudinary credentials:**
1. Sign up at https://cloudinary.com (free account)
2. Go to Dashboard → Settings → API Keys
3. Copy your Cloud Name, API Key, and API Secret
4. Set CLOUDINARY_FOLDER to "albums" or your preferred folder name

### How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add each variable one by one:
   - Key: `MONGODB_URI` → Value: your MongoDB connection string
   - Key: `CLOUDINARY_CLOUD_NAME` → Value: your cloud name
   - Key: `CLOUDINARY_API_KEY` → Value: your API key
   - Key: `CLOUDINARY_API_SECRET` → Value: your API secret
   - Key: `CLOUDINARY_FOLDER` → Value: `albums`
4. Click "Save"
5. Redeploy your project for changes to take effect

## Testing Image Upload

After setting up environment variables:

1. Navigate to `/dashboard/gallery` page
2. Click "Select Images" button
3. Choose one or more image files (JPEG, PNG, GIF, WebP)
4. Each image must be less than 10MB
5. Click upload and wait for completion

## Troubleshooting

### Error: "Cannot POST /api/images"
- Make sure all Cloudinary environment variables are set
- Check that the variables are spelled correctly

### Error: "Upload timed out"
- Try uploading fewer images at once
- Try with smaller image files
- Check your internet connection

### Error: "Invalid file type"
- Only JPEG, PNG, GIF, and WebP are supported
- Check that your file has the correct extension

### Error: "Image is too large"
- Maximum file size is 10MB per image
- Compress your images before uploading

## Default Credentials (for local testing only)

If you need to test locally, you can set temporary credentials in a `.env.local` file:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=albums
```

Never commit `.env.local` to git!
