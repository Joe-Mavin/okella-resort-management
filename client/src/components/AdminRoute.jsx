import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}

export default AdminRoute
