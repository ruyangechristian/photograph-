# Image Upload Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: App Won't Start - Middleware Manifest Error
**Error:** `Cannot find module '/.next/server/middleware-manifest.json'`

**Solution:**
- The middleware.ts file was removed to prevent build issues
- The app should now start properly
- If still having issues, clear the `.next` folder and rebuild

**Fix applied:** Removed problematic middleware.ts that was causing build failures

---

### Issue 2: Upload Button Shows but Nothing Happens
**Symptoms:** Click upload button, but no response

**Causes & Solutions:**

1. **Missing Cloudinary credentials**
   - Check that environment variables are set in Vercel
   - Navigate to Settings → Environment Variables
   - Verify: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - Redeploy after adding variables

2. **Network issue**
   - Check browser console for network errors (F12 → Network tab)
   - Verify internet connection
   - Try uploading a different image

3. **File input issue**
   - Try clearing browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
   - Try a different browser
   - Check file permissions

---

### Issue 3: "Invalid file type" Error
**Error:** `Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed`

**Solutions:**
- Supported formats: JPEG, PNG, GIF, WebP
- Not supported: BMP, TIFF, SVG, ICO, WebP2000
- Verify your file has correct extension
- Try converting the image to PNG using an online tool

---

### Issue 4: "Image is too large" Error
**Error:** `Image is too large. Maximum size is 10MB`

**Solutions:**
1. Check file size: Right-click file → Properties
2. If larger than 10MB, compress using:
   - Windows: Built-in Photos app
   - Mac: Preview app
   - Online: [TinyPNG.com](https://tinypng.com), [Compressor.io](https://compressor.io)
3. Or try uploading fewer images at once

---

### Issue 5: "Upload timed out" Error
**Error:** `Upload timed out. Please try again with a smaller file.`

**Solutions:**
1. **Reduce file size** - Compress images before uploading
2. **Upload fewer files** - Try uploading 1-2 images instead of many
3. **Check connection** - Verify stable internet connection
4. **Cloudinary status** - Check if Cloudinary is having issues at https://status.cloudinary.com

---

### Issue 6: Images Upload but Don't Appear
**Symptoms:** Upload succeeds but images don't show in gallery

**Causes:**

1. **MongoDB not connected**
   - Check `MONGODB_URI` is set correctly
   - Verify MongoDB cluster is accessible
   - Check database connection in MongoDB Atlas

2. **Database issues**
   - The image metadata might not be saved
   - Check browser console for database errors
   - Try refreshing the page (F5)

**Fix applied:** Improved response handling to ensure proper data format

---

### Issue 7: "Cannot POST /api/images" Error
**Symptoms:** Upload request fails with 404 error

**Causes:**

1. **App not running** - Make sure dev server is running
2. **Wrong URL** - Check that /api/images route exists
3. **Build issue** - Try rebuilding the project

**Fix applied:** Verified API routes are properly configured

---

### Issue 8: Delete Button Doesn't Work
**Symptoms:** Click delete, but nothing happens or error appears

**Causes:**

1. **Image not on Cloudinary** - Image metadata exists but file doesn't
2. **Cloudinary credentials invalid** - Can't authenticate to delete
3. **Permission issue** - API secret might be wrong

**Solutions:**
- Verify `CLOUDINARY_API_SECRET` is correct
- Check that image exists in Cloudinary dashboard
- Try uploading and deleting a new image

---

### Issue 9: Albums Upload Fails
**Symptoms:** Creating album with multiple images fails

**Causes:**

1. **Too many images at once** - Server timeout with 100+ images
2. **Very large images** - Each file > 5MB can cause issues
3. **Server timeout** - Request exceeded time limit

**Solutions:**
1. Upload fewer images per album (try < 50)
2. Compress all images first
3. Split into multiple albums

---

### Issue 10: Browser Console Shows JavaScript Errors
**How to check:**
1. Press F12 to open Developer Tools
2. Click "Console" tab
3. Look for red error messages

**Common console errors and fixes:**

- `CORS error` - Usually a network connectivity issue
- `undefined is not a function` - Page might not have fully loaded, refresh
- `Cannot read property 'image'` - API response format issue, should be fixed in latest version

---

## Debugging Steps

### Step 1: Check Environment Variables
```bash
# In Vercel dashboard, go to Settings → Environment Variables
# Verify these are set:
- MONGODB_URI
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_FOLDER (optional, default: 'albums')
```

### Step 2: Check Browser Console
1. Press F12
2. Go to Console tab
3. Refresh page
4. Look for any red error messages

### Step 3: Check Network Tab
1. Press F12
2. Click Network tab
3. Try uploading an image
4. Look for failed requests (red)
5. Click on `/api/images` request
6. Check Response tab for error details

### Step 4: Test API Directly
```javascript
// Run in browser console while on /dashboard/gallery
fetch('/api/images')
  .then(r => r.json())
  .then(d => console.log('Images:', d))
  .catch(e => console.error('Error:', e))
```

### Step 5: Check Server Logs
If you have access to server logs:
- Look for errors from `/api/images` endpoint
- Check Cloudinary API logs
- Verify MongoDB connection logs

---

## Getting Help

If you've tried all solutions above:

1. **Check the logs** - Look at browser console and server logs
2. **Screenshot errors** - Take screenshots of error messages
3. **Test one image** - Try uploading a simple small image
4. **Check status pages:**
   - Cloudinary: https://status.cloudinary.com
   - MongoDB: https://status.mongodb.com
   - Vercel: https://www.vercel-status.com

---

## Quick Fixes Checklist

- [ ] All environment variables set in Vercel
- [ ] Project redeployed after setting variables
- [ ] Using supported image format (JPEG, PNG, GIF, WebP)
- [ ] Image file size less than 10MB
- [ ] Internet connection is stable
- [ ] Browser cache cleared
- [ ] Tried in incognito/private window
- [ ] No browser extensions blocking uploads
- [ ] Cloudinary account is active
- [ ] MongoDB connection string is correct
