export default function Input({ label, type='text', value, onChange, placeholder, ...props }) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} {...props} />
    </div>
  )
}
