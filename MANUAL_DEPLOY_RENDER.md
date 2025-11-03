# 🚀 Manual Render Deployment (GUARANTEED TO WORK)

The Blueprint approach is having issues. Let's deploy manually - it's actually faster and more reliable!

## 📋 Step-by-Step Manual Deployment

### Part 1: Deploy Backend (5 minutes)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Click "Connect a repository"
   - Select: `Joe-Mavin/okella-resort-management`
   - Click "Connect"

3. **Configure Backend Service**
   ```
   Name: okella-resort-api
   Region: Oregon (US West)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   **Required:**
   ```
   NODE_ENV=production
   PORT=10000
   
   MONGODB_URI=mongodb+srv://mervocklads_db_user:R7M8DTzmxHqly1xJ@cluster0.5y0ugny.mongodb.net/resort-management?retryWrites=true&w=majority&appName=Cluster0
   
   JWT_SECRET=luxury-resort-secret-key-mervocklads-2024-super-secure-string-change-in-production
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   
   CLIENT_URL=https://okella-resort-frontend.onrender.com
   
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
   
   **Optional (add later):**
   ```
   BREVO_API_KEY=your-brevo-key
   BREVO_SENDER_EMAIL=noreply@okellaresort.com
   BREVO_SENDER_NAME=OKELLA RESORT
   
   MPESA_CONSUMER_KEY=your-mpesa-key
   MPESA_CONSUMER_SECRET=your-mpesa-secret
   MPESA_PASSKEY=your-mpesa-passkey
   MPESA_SHORTCODE=174379
   MPESA_ENVIRONMENT=sandbox
   MPESA_CALLBACK_URL=https://okella-resort-api.onrender.com/api/payments/mpesa/callback
   
   ADMIN_EMAIL=admin@okellaresort.com
   ADMIN_PASSWORD=Admin@12345
   ```

5. **Create Service**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Watch the logs for success

6. **Verify Backend**
   ```bash
   curl https://okella-resort-api.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Luxury Resort API is running"}`

---

### Part 2: Deploy Frontend (3 minutes)

1. **Create New Static Site**
   - Render Dashboard → "New +" → "Static Site"

2. **Connect Same Repository**
   - Select: `Joe-Mavin/okella-resort-management`
   - Click "Connect"

3. **Configure Frontend Service**
   ```
   Name: okella-resort-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variable**
   ```
   VITE_API_URL=https://okella-resort-api.onrender.com/api
   ```

5. **Create Static Site**
   - Click "Create Static Site"
   - Wait 3-5 minutes
   - Site will be live!

6. **Update Backend CLIENT_URL**
   - Go back to backend service
   - Environment → Edit `CLIENT_URL`
   - Set to: `https://okella-resort-frontend.onrender.com`
   - Save (triggers redeploy)

---

## ✅ Success Checklist

### Backend (okella-resort-api)
- [ ] Service created
- [ ] Root Directory set to `server`
- [ ] Build succeeded
- [ ] MongoDB connected (check logs)
- [ ] Health endpoint responds
- [ ] All environment variables added

### Frontend (okella-resort-frontend)
- [ ] Static site created
- [ ] Root Directory set to `client`
- [ ] Build succeeded
- [ ] Site loads in browser
- [ ] API connection works

---

## 🎯 Expected Logs

### Backend Success:
```
==> Building...
==> Running 'npm install'
added 45 packages
==> Build successful

==> Deploying...
==> Running 'npm start'
> resort-server@1.0.0 start
> node server.mjs

✅ MongoDB Connected: cluster0.5y0ugny.mongodb.net
✅ Server running on port 10000
```

### Frontend Success:
```
==> Building...
==> Running 'npm install && npm run build'
added 312 packages
> vite build
✓ built in 15s
==> Build successful

==> Static site deployed
```

---

## 🔧 Troubleshooting

### Backend: "Cannot find module"
**Solution:** Verify Root Directory is set to `server` (not empty!)

### Backend: "MongoDB connection failed"
**Solution:** Check `MONGODB_URI` is set correctly in environment variables

### Frontend: "Failed to fetch"
**Solution:** 
1. Verify backend is running
2. Check `VITE_API_URL` points to correct backend URL
3. Update `CLIENT_URL` in backend to match frontend URL

### Backend: "CORS error"
**Solution:** Update `CLIENT_URL` in backend environment to match your frontend URL exactly

---

## 📱 Your Live URLs

After successful deployment:

- **Frontend**: `https://okella-resort-frontend.onrender.com`
- **Backend API**: `https://okella-resort-api.onrender.com`
- **Admin Panel**: `https://okella-resort-frontend.onrender.com/admin`
- **API Health**: `https://okella-resort-api.onrender.com/api/health`

---

## 🎉 Post-Deployment

### 1. Create Admin User
Backend service → Shell tab:
```bash
node scripts/create-admin.mjs
```

### 2. Login
- Go to: `https://okella-resort-frontend.onrender.com/login`
- Email: `admin@okellaresort.com`
- Password: `Admin@123456`

### 3. Upload Images
- Admin → Gallery
- Upload hero images, room images, etc.

### 4. Add Content
- Admin → Rooms: Add room listings
- Admin → Activities: Add activities
- Admin → Blog: Create posts

---

## 💡 Pro Tips

1. **Cloudinary is REQUIRED** - The gallery won't work without it
2. **Free Tier Spins Down** - First request after 15 min takes ~30 seconds
3. **Custom Domain** - Add in Render settings (requires paid plan)
4. **Always-On** - Upgrade to Render Pro ($7/mo) to avoid spin-down

---

## 🚀 Why Manual is Better

✅ **More Control** - You see exactly what's being configured
✅ **Easier Debugging** - Clear logs and error messages
✅ **No Blueprint Issues** - Avoids YAML parsing problems
✅ **Faster Setup** - No waiting for Blueprint detection
✅ **Better Understanding** - You know how everything connects

---

## ⏱️ Total Time: ~10 Minutes

- Backend setup: 5 minutes
- Frontend setup: 3 minutes
- Verification: 2 minutes

**Much faster than debugging Blueprint issues!**

---

## 📞 Still Having Issues?

1. **Check Service Logs** - Most errors are clearly shown
2. **Verify Root Directory** - Must be `server` or `client`
3. **Test Locally** - Ensure app works on your machine first
4. **Environment Variables** - Double-check all required vars are set

---

## ✨ You're Almost There!

Follow these manual steps and your app will be live in 10 minutes!

**Start with Part 1 (Backend), then Part 2 (Frontend).**

**Good luck! 🚀**
