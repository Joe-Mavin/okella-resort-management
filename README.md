# 🏖️ Luxury Coastal Resort Management System

A complete modern resort management platform with integrated M-PESA payment system, built with the MERN stack. Features a sleek, premium UI/UX designed for luxury hospitality.

## ✨ Features

### 🎯 Core Features
- **Advanced Booking System** - Real-time availability, dynamic pricing, multi-room booking
- **M-PESA Integration** - Seamless STK Push payments with Daraja API
- **User Portal** - Booking history, profile management, cancellations
- **Admin Dashboard** - Analytics, revenue tracking, booking management
- **Review System** - Guest ratings and testimonials
- **Blog & Content** - SEO-optimized blog with admin CMS
- **Activities Booking** - Tours, spa, events with integrated payments
- **Email Automation** - Brevo API for confirmations and notifications

### 🎨 Design Features
- **Premium UI/UX** - Ocean-themed design with aqua blue (#00A8B5) accents
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Smooth Animations** - Framer Motion for elegant transitions
- **Image Galleries** - Cloudinary integration for optimized images
- **Dark/Light Mode** - Theme switcher for user preference
- **PWA Support** - Offline viewing and app-like experience

### 🔒 Security Features
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Admin, Staff, Guest permissions
- **Rate Limiting** - API protection
- **Helmet.js** - Security headers
- **Data Validation** - Express-validator for inputs

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TailwindCSS 3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Analytics visualization
- **Swiper** - Image carousels

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Integrations
- **M-PESA Daraja API** - Payment processing
- **Brevo API** - Email services
- **Cloudinary** - Image management
- **MongoDB Atlas** - Cloud database (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- MongoDB (local or Atlas)
- M-PESA Daraja API credentials
- Brevo API key
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
cd resort-management
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start MongoDB** (if using local)
```bash
mongod
```

5. **Run the application**
```bash
npm run dev
```

The application will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
resort-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # Context providers
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   ├── public/            # Public files
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── models/           # Mongoose models
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── server.mjs        # Entry point
│
└── package.json          # Root package.json
```

## 🔧 Configuration

### M-PESA Setup
1. Register at [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create an app and get credentials
3. Configure callback URL in your .env
4. Test with sandbox before production

### Brevo Email Setup
1. Create account at [Brevo](https://www.brevo.com/)
2. Get API key from settings
3. Verify sender email
4. Configure templates (optional)

### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get cloud name, API key, and secret
3. Configure upload presets
4. Set folder structure

## 🎨 UI/UX Guidelines

### Color Palette
- **Primary**: Aqua Blue (#00A8B5)
- **Background**: Ivory White (#FFFFFF)
- **Accent**: Sand Beige (#F7E9D7)
- **Text**: Charcoal Gray (#2E2E2E)

### Typography
- **Headings**: Poppins Bold
- **Body**: Inter Regular
- **Buttons**: Poppins Medium

### Components
- Rounded corners (8px-16px)
- Subtle shadows for depth
- Gradient overlays on images
- Smooth hover transitions
- Card-based layouts

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/verify` - Verify JWT token

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Rooms
- `GET /api/rooms` - Get available rooms
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Payments
- `POST /api/payments/mpesa/initiate` - Initiate M-PESA payment
- `POST /api/payments/mpesa/callback` - M-PESA callback
- `GET /api/payments/:id` - Get payment status

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
cd server
# Push to Git repository
# Connect to Railway/Render
# Set environment variables
```

### Environment Variables
Ensure all environment variables are set in production:
- MongoDB Atlas connection string
- M-PESA production credentials
- Brevo API key
- Cloudinary credentials
- JWT secret (strong, random)

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test M-PESA Integration
Use the sandbox environment with test phone numbers:
- 254708374149
- 254711173149

## 📱 Mobile Responsiveness

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - feel free to use for your resort project!

## 👥 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@yourresort.com
- WhatsApp: +254700000000

## 🎯 Roadmap

- [ ] AI Concierge Chatbot
- [ ] Multi-language support (Swahili, French)
- [ ] Mobile app (React Native)
- [ ] Integration with booking platforms
- [ ] Advanced analytics dashboard
- [ ] Loyalty program system

---

Built with ❤️ for luxury hospitality
