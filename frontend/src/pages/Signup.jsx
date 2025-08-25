import { useState } from 'react'
import Input from '../components/Input'
import RoleSelector from '../components/RoleSelector'
import { register } from '../services/authService'
import { ROLES } from '../utils/roles'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [roleInfo, setRoleInfo] = useState({})
  const [message, setMessage] = useState(null)
  const [verifyToken, setVerifyToken] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await register({ name, email, password, role, roleInfo })
      setMessage(res.message)
      if (res.devVerifyToken) setVerifyToken(res.devVerifyToken)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  const roleFields = () => {
    switch (role) {
      case ROLES.THINKER:
        return (
          <>
            <Input label="Industry" value={roleInfo.industry || ''} onChange={(v)=>setRoleInfo({...roleInfo, industry: v})} />
            <Input label="Idea Stage" value={roleInfo.ideaStage || ''} onChange={(v)=>setRoleInfo({...roleInfo, ideaStage: v})} />
          </>
        )
      case ROLES.INVESTOR:
        return (
          <>
            <Input label="Firm Name" value={roleInfo.firmName || ''} onChange={(v)=>setRoleInfo({...roleInfo, firmName: v})} />
            <Input label="Investment Range" value={roleInfo.investmentRange || ''} onChange={(v)=>setRoleInfo({...roleInfo, investmentRange: v})} />
          </>
        )
      case ROLES.MENTOR:
        return (
          <>
            <Input label="Expertise" value={roleInfo.expertise || ''} onChange={(v)=>setRoleInfo({...roleInfo, expertise: v})} />
            <Input label="Years Experience" type="number" value={roleInfo.yearsExperience || ''} onChange={(v)=>setRoleInfo({...roleInfo, yearsExperience: Number(v)})} />
          </>
        )
      default: return null
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card">
        <h1 className="text-xl font-semibold mb-4">Create your account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Email" type="email" value={email} onChange={setEmail} />
          <Input label="Password" type="password" value={password} onChange={setPassword} />
          <RoleSelector value={role} onChange={setRole} />
          {roleFields()}
          <button className="bg-black text-white w-full">Sign up</button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="underline">Log in</Link></p>
        {message && <div className="mt-4 text-sm">{message}</div>}
        {verifyToken && (
          <div className="mt-2 text-xs break-all">
            Dev verify token: {verifyToken}<br/>
            Visit <code>/verify-email?token=...</code> to verify.
          </div>
        )}
      </div>
      <div className="hidden md:block">
        <h2 className="text-lg font-medium mb-2">Welcome to Idea Platform</h2>
        <p className="text-sm text-gray-600">Create an account as a Thinker, Investor, or Mentor. Verify your email and start exploring.</p>
      </div>
    </div>
  )
}
