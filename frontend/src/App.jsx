import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './hooks/useAuth.jsx'

export default function App() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b mb-8">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Idea Platform</Link>
          <div className="space-x-3">
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}
