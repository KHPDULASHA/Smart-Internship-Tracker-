import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function NotFoundPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Page not found</h1>
      <p>
        <Link to={ROUTES.home}>Go home</Link>
      </p>
    </div>
  )
}
