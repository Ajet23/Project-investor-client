import api from './api'

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function verifyEmail(token) {
  const { data } = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function refresh(userId) {
  const { data } = await api.post('/auth/refresh', { userId })
  return data
}

export async function logout(userId) {
  const { data } = await api.post('/auth/logout', { userId })
  return data
}

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(token, newPassword) {
  const { data } = await api.post('/auth/reset-password', { token, newPassword })
  return data
}

export async function getMe(accessToken) {
  const { data } = await api.get('/protected/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return data.user
}
