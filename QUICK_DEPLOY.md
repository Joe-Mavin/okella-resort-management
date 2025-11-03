# ⚡ QUICK DEPLOY - OKELLA RESORT

## 🚀 Deploy in 5 Minutes!

### Step 1: Push to GitHub (2 minutes)

```bash
# If you haven't created a GitHub repo yet:
# 1. Go to https://github.com/new
# 2. Create repository named: okella-resort-management
# 3. Don't initialize with README

# Then run these commands:
git remote add origin https://github.com/YOUR_USERNAME/okella-resort-management.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Render.com (3 minutes)

1. **Go to [Render.com](https://render.com)** and sign up (free)

2. **Click "New +" → "Blueprint"**

3. **Connect your GitHub repository**
   - Authorize Render to access your GitHub
   - Select `okella-resort-management` repository

4. **Render will detect `render.yaml` automatically**
   - Click "Apply"
   - It will create 2 services:
     - `okella-resort-api` (Backend)
     - `okella-resort` (Frontend)

5. **Add Required Environment Variables**
   
   For `okella-resort-api` service, add:
   
   ```
   MONGODB_URI=your-mongodb-connection-string
   
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```
   
   *(Optional - for full functionality):*
   ```
   BREVO_API_KEY=your-brevo-key
   MPESA_CONSUMER_KEY=your-mpesa-key
   MPESA_CONSUMER_SECRET=your-mpesa-secret
   MPESA_PASSKEY=your-mpesa-passkey
   ```

6. **Wait 5-10 minutes for deployment**
   - Watch the build logs
   - Both services should turn green when ready

7. **Your app is LIVE! 🎉**
   - Frontend: `https://okella-resort.onrender.com`
   - Backend: `https://okella-resort-api.onrender.com`

---

### Step 3: Post-Deployment Setup (1 minute)

1. **Create Admin User**
   - Go to your backend service on Render
   - Click "Shell" tab
   - Run: `cd server && node scripts/create-admin.mjs`
   
   Or simply register at: `https://okella-resort.onrender.com/register`
   Then manually update the user's role to 'admin' in MongoDB

2. **Login and Upload Images**
   - Login: `https://okella-resort.onrender.com/login`
   - Email: `admin@okellaresort.com`
   - Password: `Admin@123456`
   - Go to Admin → Gallery
   - Upload your resort images!

---

## 🆓 FREE Services You Need

### 1. MongoDB Atlas (Required - FREE)
1. Sign up: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a FREE cluster
3. Create database user with username and password
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get connection string and add to Render environment variables

### 2. Cloudinary (Required for images)
1. Sign up: [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Add to Render environment variables

### 3. Brevo (Optional - for emails)
1. Sign up: [brevo.com](https://brevo.com)
2. Get API key
3. Add to Render environment variables

### 4. M-PESA (Optional - for payments)
1. Sign up: [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create sandbox app
3. Add credentials to Render

---

## 📱 Alternative: Deploy Frontend Only (Fastest!)

If you just want to see the frontend quickly:

### Vercel (30 seconds!)

```bash
cd client
npm install -g vercel
vercel
```

Follow prompts, and you're live!

---

## 🔥 Even Faster: Use Existing MongoDB

The deployment config already includes a working MongoDB connection:
```
mongodb+srv://mervocklads_db_user:R7M8DTzmxHqly1xJ@cluster0.5y0ugny.mongodb.net/resort-management
```

This means you can deploy immediately without setting up your own database!

---

## ⚠️ Important Notes

1. **Free Tier Limitations**
   - Render free tier spins down after 15 min inactivity
   - First request after spin-down takes ~30 seconds
   - Upgrade to Render Pro ($7/mo) for always-on

2. **Cloudinary is REQUIRED**
   - The app won't work without it (for image uploads)
   - Free tier: 25GB storage, 25GB bandwidth
   - Sign up takes 2 minutes

3. **Default Admin Credentials**
   - Email: `admin@okellaresort.com`
   - Password: `Admin@123456`
   - **CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

---

## 🎯 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render Blueprint deployed
- [ ] MongoDB connected (already done!)
- [ ] Cloudinary credentials added
- [ ] Admin user created
- [ ] First login successful
- [ ] Images uploaded to gallery
- [ ] Homepage looks beautiful!

---

## 🆘 Troubleshooting

**Build Failed?**
- Check Render logs for specific error
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

**Can't Login?**
- Create admin user via Shell command
- Check MongoDB connection
- Verify JWT_SECRET is set

**Images Not Working?**
- Add Cloudinary credentials
- Test credentials in Cloudinary dashboard
- Check browser console for errors

**Backend Not Responding?**
- Free tier may be spinning down
- Wait 30 seconds and retry
- Check Render service status

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Render settings (free on paid plans)
2. **Environment Sync**: Use Render's environment groups for easier management
3. **Monitoring**: Enable Render's monitoring and alerts
4. **Backups**: MongoDB Atlas provides automatic backups
5. **Performance**: Consider upgrading to Render Pro for production use

---

## 🎉 You're Done!

Your OKELLA RESORT Management System is now live and accessible worldwide!

**Share your live URL:**
- Frontend: `https://okella-resort.onrender.com`
- Admin Panel: `https://okella-resort.onrender.com/admin`

**Next Steps:**
1. Upload beautiful resort images
2. Add room listings
3. Configure M-PESA for payments
4. Customize branding and content
5. Share with the world!

---

**Need Help?** Check `DEPLOYMENT.md` for detailed instructions.
