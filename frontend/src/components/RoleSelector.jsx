import { ROLES } from '../utils/roles'

export default function RoleSelector({ value, onChange }) {
  return (
    <div>
      <label>Role</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select role</option>
        <option value={ROLES.THINKER}>Thinker</option>
        <option value={ROLES.INVESTOR}>Investor</option>
        <option value={ROLES.MENTOR}>Mentor</option>
      </select>
    </div>
  )
}
