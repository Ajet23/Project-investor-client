import { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, refresh as apiRefresh, logout as apiLogout, getMe } from '../services/authService'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, try to refresh (requires userId saved) - MVP: store userId in localStorage after login
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const u = JSON.parse(storedUser)
      apiRefresh(u.id).then(({ accessToken }) => {
        setAccessToken(accessToken)
        return getMe(accessToken)
      }).then((u) => {
        setUser(u)
      }).catch(() => {
        // ignore
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { accessToken, user } = await apiLogin(email, password)
    setAccessToken(accessToken)
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = async () => {
    if (user?.id) await apiLogout(user.id)
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = { user, accessToken, login, logout }
  if (loading) return <div className="p-6">Loading...</div>
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() { return useContext(AuthCtx) }
