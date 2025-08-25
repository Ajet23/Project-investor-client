import { useState } from 'react'
import Input from '../components/Input'
import { forgotPassword } from '../services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [resetToken, setResetToken] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await forgotPassword(email)
    setMessage(res.message)
    if (res.devResetToken) setResetToken(res.devResetToken)
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Forgot password</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <button className="bg-black text-white w-full">Send reset link</button>
      </form>
      {message && <div className="mt-4 text-sm">{message}</div>}
      {resetToken && <div className="mt-2 text-xs break-all">Dev reset token: {resetToken}</div>}
    </div>
  )
}
