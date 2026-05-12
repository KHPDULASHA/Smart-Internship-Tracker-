import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { InternshipsTable } from '../components/internships/InternshipsTable'
import { PageHeading } from '../components/common/PageHeading'
import { ROUTES } from '../constants/routes'
import { fetchInternships } from '../services/internshipService'
import { getStoredUserId } from '../services/authService'
import type { InternshipReadDto } from '../types/api'

export default function InternshipsPage() {
  const userId = getStoredUserId()
  const [items, setItems] = useState<InternshipReadDto[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) {
      setError('Sign in to load internships.')
      setItems([])
      return
    }
    setError(null)
    try {
      const data = await fetchInternships(userId)
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div>
      <PageHeading title="Internships" subtitle="Your applications and pipeline." />
      {userId ? (
        <p style={{ marginBottom: '1rem' }}>
          <Link to={ROUTES.internshipNew}>+ Add internship</Link>
        </p>
      ) : null}
      {!userId ? (
        <p>
          Please <Link to={ROUTES.login}>log in</Link>.
        </p>
      ) : null}
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {userId && items === null ? <p>Loading…</p> : null}
      {userId && items && items.length === 0 ? <p>No internships yet.</p> : null}
      {userId && items && items.length > 0 ? (
        <InternshipsTable userId={userId} internships={items} onChanged={() => void load()} />
      ) : null}
    </div>
  )
}
