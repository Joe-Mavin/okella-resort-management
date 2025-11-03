# 🏖️ Luxury Resort Management System - Installation Guide

This guide will help you set up and run the complete resort management system on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)
- **Code Editor** - VS Code recommended

### Required API Keys & Accounts

1. **M-PESA Daraja API** (for payments)
   - Register at: https://developer.safaricom.co.ke/
   - Get: Consumer Key, Consumer Secret, Passkey, Shortcode

2. **Brevo (Email Service)**
   - Sign up at: https://www.brevo.com/
   - Get: API Key

3. **Cloudinary (Image Storage)**
   - Sign up at: https://cloudinary.com/
   - Get: Cloud Name, API Key, API Secret

## 🚀 Quick Start

### Step 1: Clone or Navigate to Project

```bash
cd resort-management
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### Step 3: Set Up Environment Variables

#### Server Environment Variables

```bash
cd server
copy .env.example .env
```

Edit `server/.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/resort-management
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resort-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# M-PESA Daraja API Configuration
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=http://localhost:5000/api/payments/mpesa/callback

# Brevo Email API Configuration
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@yourresort.com
BREVO_SENDER_NAME=Luxury Coastal Resort

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
CLIENT_URL=http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=admin@yourresort.com
ADMIN_PASSWORD=Admin@12345
```

#### Client Environment Variables

```bash
cd ../client
copy .env.example .env
```

Edit `client/.env`:

```env
# Leave empty for development (uses proxy)
VITE_API_URL=
```

### Step 4: Start MongoDB

#### If using local MongoDB:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### If using MongoDB Atlas:
- No action needed, just ensure your connection string is correct in `.env`

### Step 5: Run the Application

Open **two terminals**:

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend Client:**
```bash
cd client
npm run dev
```

OR use the root command to run both:

```bash
# From root directory
npm run dev
```

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🎯 Creating Admin User

You can create an admin user in two ways:

### Option 1: Manual Database Entry

1. Register a normal user through the website
2. Connect to MongoDB:
   ```bash
   mongosh resort-management
   ```
3. Update user role:
   ```javascript
   db.users.updateOne(
     { email: "admin@yourresort.com" },
     { $set: { role: "admin" } }
   )
   ```

### Option 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `users` collection
4. Find your user and edit the `role` field to `"admin"`

## 📱 Testing M-PESA Integration

### Sandbox Environment

Use these test phone numbers:
- `254708374149`
- `254711173149`

### Test Flow:
1. Create a booking
2. Go to payment page
3. Enter test phone number
4. Enter PIN: `1234` (in sandbox)
5. Payment will be processed

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available` - Get available rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/mpesa/initiate` - Initiate M-PESA payment
- `GET /api/payments/:id/status` - Check payment status
- `GET /api/payments/my-payments` - Get user payments

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get all reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `POST /api/blog` - Create blog post (admin)
- `PUT /api/blog/:id` - Update blog post (admin)
- `DELETE /api/blog/:id` - Delete blog post (admin)

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity details
- `POST /api/activities/:id/book` - Book activity
- `POST /api/activities` - Create activity (admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics/revenue` - Revenue analytics
- `GET /api/admin/analytics/bookings` - Booking analytics
- `GET /api/admin/analytics/users` - User analytics

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Browse rooms and view details
- [ ] Check room availability
- [ ] Create a booking
- [ ] Make M-PESA payment
- [ ] View booking history
- [ ] Write a review
- [ ] Browse activities
- [ ] Admin dashboard access
- [ ] Admin room management
- [ ] Admin booking management

## 🚨 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError`

**Solution**:
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. For Atlas, whitelist your IP address

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

### M-PESA Callback Not Working

**Solution**:
1. Use ngrok for local development:
   ```bash
   ngrok http 5000
   ```
2. Update `MPESA_CALLBACK_URL` in `.env` with ngrok URL
3. Restart server

### Email Not Sending

**Solution**:
1. Verify Brevo API key
2. Verify sender email is verified in Brevo
3. Check Brevo dashboard for errors

### Images Not Uploading

**Solution**:
1. Verify Cloudinary credentials
2. Check folder permissions
3. Ensure file size is within limits

## 📦 Project Structure

```
resort-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── server.mjs        # Entry point
│
└── package.json          # Root package.json
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Change default admin credentials** immediately
4. **Enable HTTPS in production**
5. **Whitelist IPs for MongoDB Atlas**
6. **Use environment-specific configs**
7. **Implement rate limiting** - Already configured
8. **Validate all inputs** - Using express-validator

## 🌍 Production Deployment

### Backend (Railway/Render)

1. Create account on Railway or Render
2. Create new project
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend (Vercel/Netlify)

1. Create account on Vercel or Netlify
2. Import project from GitHub
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-api-url.com/api`
6. Deploy

## 💡 Tips for Development

1. **Use MongoDB Compass** for database visualization
2. **Use Postman** for API testing
3. **Enable React DevTools** for debugging
4. **Check browser console** for errors
5. **Monitor server logs** for backend issues
6. **Use Chrome DevTools Network tab** for API calls

## 📞 Support

If you encounter any issues:

1. Check this installation guide
2. Review error messages carefully
3. Check server and client logs
4. Verify all environment variables
5. Ensure all services are running

## 🎉 You're All Set!

Your luxury resort management system is now running. Visit http://localhost:5173 to start exploring!

Happy coding! 🏖️
