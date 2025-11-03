import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './layouts/Layout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Rooms = lazy(() => import('./pages/Rooms'))
const RoomDetails = lazy(() => import('./pages/RoomDetails'))
const Activities = lazy(() => import('./pages/Activities'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

// User pages
const Profile = lazy(() => import('./pages/user/Profile'))
const MyBookings = lazy(() => import('./pages/user/MyBookings'))
const BookingDetails = lazy(() => import('./pages/user/BookingDetails'))
const MyActivityBookings = lazy(() => import('./pages/user/MyActivityBookings'))

// Booking flow
const BookRoom = lazy(() => import('./pages/BookRoom'))
const Payment = lazy(() => import('./pages/Payment'))
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminRooms = lazy(() => import('./pages/admin/Rooms'))
const AdminBookings = lazy(() => import('./pages/admin/Bookings'))
const AdminPayments = lazy(() => import('./pages/admin/Payments'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminReviews = lazy(() => import('./pages/admin/Reviews'))
const AdminBlog = lazy(() => import('./pages/admin/Blog'))
const AdminActivities = lazy(() => import('./pages/admin/Activities'))
const AdminGallery = lazy(() => import('./pages/admin/GalleryManagement'))

const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetails />} />
          <Route path="activities" element={<Activities />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          
          {/* Auth routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
            <Route path="my-activities" element={<MyActivityBookings />} />
            <Route path="book/:roomId" element={<BookRoom />} />
            <Route path="payment/:bookingId" element={<Payment />} />
            <Route path="booking-success/:bookingId" element={<BookingSuccess />} />
          </Route>

          {/* Admin routes */}
          <Route path="admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="activities" element={<AdminActivities />} />
              <Route path="gallery" element={<AdminGallery />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
