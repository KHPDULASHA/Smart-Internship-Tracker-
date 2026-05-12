import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Outlet />
      </div>
    </div>
  )
}
