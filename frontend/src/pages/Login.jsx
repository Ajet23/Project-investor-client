import { useState } from 'react'
import Input from '../components/Input'
import { useAuth } from '../hooks/useAuth.jsx'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Log in</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <Input label="Password" type="password" value={password} onChange={setPassword} />
        <button className="bg-black text-white w-full">Log in</button>
      </form>
      <div className="text-sm mt-4 flex justify-between">
        <Link to="/forgot-password" className="underline">Forgot password?</Link>
        <Link to="/signup" className="underline">Create account</Link>
      </div>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  )
}
