# Quick Start - Image Upload Setup

## 🚀 Do This First (5 minutes)

### 1. Get Cloudinary Credentials
- Sign up: https://cloudinary.com (free)
- Dashboard → Settings → API Keys
- Copy: Cloud Name, API Key, API Secret

### 2. Set Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add these 3 variables:
   ```
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = your_api_key
   CLOUDINARY_API_SECRET = your_api_secret
   ```
3. Save
4. **Redeploy** your project

### 3. Test Upload
1. Go to `/dashboard/gallery`
2. Click "Select Images"
3. Pick a JPG, PNG, GIF, or WebP (under 10MB)
4. Upload should work!

---

## ✅ Success Signs
- ✓ App loads without errors
- ✓ Upload button works
- ✓ Image appears in gallery
- ✓ Can delete images

---

## ❌ If It Doesn't Work

**First check:**
```
Settings → Environment Variables
- CLOUDINARY_CLOUD_NAME ✓
- CLOUDINARY_API_KEY ✓
- CLOUDINARY_API_SECRET ✓
```

Then redeploy!

**Still failing?**
- Clear browser cache (Ctrl+Shift+Del)
- Check browser console (F12)
- Try incognito window
- See TROUBLESHOOTING.md for more help

---

## 📝 What Was Fixed

- ✅ App startup issues (middleware removed)
- ✅ Upload response format fixed
- ✅ Better error messages
- ✅ Cloudinary validation added
- ✅ Timeout handling improved

---

## 📖 Need Help?

- **Setup?** → `ENV_SETUP.md`
- **Issues?** → `TROUBLESHOOTING.md`
- **Details?** → `IMAGE_UPLOAD_FIXES.md`
