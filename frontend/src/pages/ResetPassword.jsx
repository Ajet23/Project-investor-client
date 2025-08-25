import { useEffect, useState } from 'react'
import Input from '../components/Input'
import { resetPassword } from '../services/authService'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const tokenFromQuery = params.get('token') || ''
  const [token, setToken] = useState(tokenFromQuery)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{ setToken(tokenFromQuery) }, [tokenFromQuery])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await resetPassword(token, newPassword)
      setMessage(res.message)
      setTimeout(()=>navigate('/login'), 1200)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Reset password</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Token" value={token} onChange={setToken} />
        <Input label="New Password" type="password" value={newPassword} onChange={setNewPassword} />
        <button className="bg-black text-white w-full">Update password</button>
      </form>
      {message && <div className="mt-4 text-sm">{message}</div>}
    </div>
  )
}
