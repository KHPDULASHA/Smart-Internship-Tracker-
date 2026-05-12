import { Link, NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { clearSession, getStoredEmail } from '../../services/authService'

const linkStyle = { marginRight: '1rem' }

export function NavBar() {
  const email = getStoredEmail()

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #ddd',
      }}
    >
      <strong>
        <Link to={ROUTES.home}>Internship Tracker</Link>
      </strong>
      <nav style={{ flex: 1 }}>
        <NavLink to={ROUTES.dashboard} style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to={ROUTES.internships} style={linkStyle}>
          Internships
        </NavLink>
        <NavLink to={ROUTES.skills} style={linkStyle}>
          Skills
        </NavLink>
      </nav>
      <span style={{ fontSize: '0.875rem', color: '#555' }}>{email ?? 'Not signed in'}</span>
      <Link to={ROUTES.login}>Log in</Link>
      <button
        type="button"
        style={{ marginLeft: '0.5rem' }}
        onClick={() => {
          clearSession()
          window.location.assign(ROUTES.login)
        }}
      >
        Log out
      </button>
    </header>
  )
}
