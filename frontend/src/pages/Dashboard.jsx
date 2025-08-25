import { useAuth } from '../hooks/useAuth.jsx'
import { ROLES } from '../utils/roles'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button onClick={logout} className="bg-gray-800 text-white">Logout</button>
      </div>
      <p className="mb-2">Welcome, <span className="font-medium">{user?.name}</span>!</p>
      <p className="mb-4">Role: <span className="font-medium">{user?.role}</span></p>

      {user?.role === ROLES.MENTOR && (
        <div className="p-3 rounded-lg border bg-gray-50 mb-2">Mentor area placeholder. (Protected backend route /protected/mentor)</div>
      )}
      {user?.role === ROLES.INVESTOR && (
        <div className="p-3 rounded-lg border bg-gray-50 mb-2">Investor area placeholder. (Protected backend route /protected/investor)</div>
      )}
      {user?.role === ROLES.THINKER && (
        <div className="p-3 rounded-lg border bg-gray-50 mb-2">Thinker area placeholder. (Protected backend route /protected/thinker)</div>
      )}

      <div className="text-sm text-gray-600 mt-6">
        Future modules: Idea Posting, Investor Matchmaking, Mentor Review, etc.
      </div>
    </div>
  )
}
