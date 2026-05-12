import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: 640 }}>
      <h1>Smart Internship Tracker</h1>
      <p>Track deadlines, application status, and skill gaps in one place.</p>
      <ul>
        <li>
          <Link to={ROUTES.login}>Log in</Link>
        </li>
        <li>
          <Link to={ROUTES.register}>Create account</Link>
        </li>
        <li>
          <Link to={ROUTES.dashboard}>Dashboard</Link> (after signing in)
        </li>
      </ul>
    </div>
  )
}
