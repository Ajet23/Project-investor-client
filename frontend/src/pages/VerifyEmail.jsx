import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { verifyEmail } from '../services/authService'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      verifyEmail(token).then((res) => {
        setMessage(res.message)
        setTimeout(()=>navigate('/login'), 1000)
      }).catch(err => {
        setMessage(err.response?.data?.message || 'Error')
      })
    }
  }, [token])

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-2">Email Verification</h1>
      <p className="text-sm">{message || 'Verifying...'}</p>
    </div>
  )
}
