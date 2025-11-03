# 🚀 OKELLA RESORT - Deployment Guide

## Quick Deploy Options

### Option 1: Render.com (Recommended - FREE)
**Best for**: Full-stack deployment with database
**Time**: 10-15 minutes
**Cost**: FREE tier available

#### Steps:
1. **Push to GitHub** (see below)
2. **Go to [Render.com](https://render.com)** and sign up
3. **Create New Blueprint**
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`
4. **Add Environment Variables**
   - MongoDB URI (from MongoDB Atlas)
   - Cloudinary credentials
   - M-PESA credentials (optional for testing)
   - Brevo API key (optional for emails)
5. **Deploy** - Click "Apply" and wait 5-10 minutes

**Live URLs:**
- Frontend: `https://okella-resort.onrender.com`
- Backend API: `https://okella-resort-api.onrender.com`

---

### Option 2: Vercel (Frontend) + Render (Backend)
**Best for**: Fastest frontend deployment
**Time**: 5-10 minutes
**Cost**: FREE

#### Frontend (Vercel):
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `client`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy

#### Backend (Render):
1. Go to [Render.com](https://render.com)
2. New Web Service
3. Connect repository
4. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add all environment variables
6. Deploy

---

### Option 3: Railway.app
**Best for**: Simple full-stack deployment
**Time**: 10 minutes
**Cost**: FREE with $5 credit

1. Go to [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add two services:
   - **Backend**: Root = `server`, Start = `npm start`
   - **Frontend**: Root = `client`, Build = `npm run build`
4. Add environment variables
5. Deploy

---

## Prerequisites

### 1. MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create FREE cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string

### 2. Cloudinary (Image Storage)
1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for FREE account
3. Get credentials from dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 3. M-PESA (Optional - for payments)
1. Go to [Daraja Portal](https://developer.safaricom.co.ke)
2. Create app for sandbox testing
3. Get Consumer Key and Secret

### 4. Brevo (Optional - for emails)
1. Go to [Brevo.com](https://www.brevo.com)
2. Sign up for FREE account
3. Get API key from settings

---

## GitHub Setup

### 1. Create GitHub Repository
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - OKELLA RESORT Management System"
```

### 2. Create Repository on GitHub
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name: `okella-resort-management`
4. Don't initialize with README (we have one)
5. Create repository

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/okella-resort-management.git
git branch -M main
git push -u origin main
```

---

## Environment Variables Reference

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resort?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# M-PESA (Safaricom Daraja)
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_PASSKEY=your-passkey
MPESA_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://your-backend-url.com/api/payments/mpesa/callback

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@okellaresort.com
BREVO_SENDER_NAME=OKELLA RESORT

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client URL
CLIENT_URL=https://your-frontend-url.com

# Admin
ADMIN_EMAIL=admin@okellaresort.com
ADMIN_PASSWORD=Admin@12345
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## Post-Deployment Steps

### 1. Create Admin User
Once backend is deployed:
```bash
# SSH into your server or use Render shell
cd server
node scripts/create-admin.mjs
```

Or use the API:
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@okellaresort.com",
    "phone": "254700000000",
    "password": "Admin@123456",
    "role": "admin"
  }'
```

### 2. Upload Initial Images
1. Login to admin panel: `https://your-frontend-url.com/login`
2. Go to Gallery Management
3. Upload hero images, room images, etc.

### 3. Configure Domain (Optional)
- Add custom domain in Render/Vercel settings
- Update CORS settings in backend
- Update CLIENT_URL environment variable

### 4. Test Everything
- [ ] User registration and login
- [ ] Room browsing and booking
- [ ] Payment processing (M-PESA)
- [ ] Image gallery
- [ ] Admin dashboard
- [ ] Email notifications

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Update `CLIENT_URL` in backend .env
- Check CORS configuration in `server.mjs`

**2. Database Connection Failed**
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

**3. Images Not Loading**
- Verify Cloudinary credentials
- Check image URLs in database
- Test Cloudinary connection

**4. M-PESA Not Working**
- Use sandbox mode for testing
- Verify callback URL is accessible
- Check Daraja portal for errors

**5. Build Failures**
- Check Node.js version (use 18.x or 20.x)
- Verify all dependencies are in package.json
- Check build logs for specific errors

### Logs and Monitoring

**Render:**
- View logs in Render dashboard
- Enable log streaming for real-time monitoring

**Vercel:**
- Check deployment logs in Vercel dashboard
- Use Vercel Analytics for performance monitoring

---

## Performance Optimization

### 1. Enable Caching
- Cloudinary provides automatic CDN caching
- Configure browser caching headers

### 2. Database Indexing
Already configured in models for:
- User email lookups
- Booking queries
- Gallery image searches

### 3. Image Optimization
- Cloudinary auto-optimization enabled
- Lazy loading implemented
- Responsive images with srcset

### 4. API Rate Limiting
- Already configured in server.mjs
- 100 requests per 15 minutes per IP

---

## Scaling Considerations

### Free Tier Limitations
- **Render**: Spins down after 15 min inactivity
- **Vercel**: 100GB bandwidth/month
- **MongoDB Atlas**: 512MB storage

### Upgrade Path
1. **Render Pro** ($7/month) - Always-on, better performance
2. **MongoDB Atlas M10** ($57/month) - Dedicated cluster
3. **Cloudinary Pro** ($89/month) - More storage and bandwidth

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB IP whitelist
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular security updates

---

## Support

For deployment issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Review this guide thoroughly

---

## Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/okella-resort-management.git
cd okella-resort-management

# Install dependencies
cd server && npm install
cd ../client && npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Run locally
cd server && npm run dev
cd client && npm run dev

# Build for production
cd client && npm run build
cd server && npm start
```

---

**Ready to Deploy?** Follow Option 1 (Render) for the easiest full-stack deployment!

**Questions?** Check the troubleshooting section or review deployment logs.
