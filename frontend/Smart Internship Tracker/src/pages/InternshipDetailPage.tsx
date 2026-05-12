import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeading } from '../components/common/PageHeading'
import { ROUTES } from '../constants/routes'
import { fetchInternshipById } from '../services/internshipService'
import { getStoredUserId } from '../services/authService'
import type { InternshipReadDto } from '../types/api'

export default function InternshipDetailPage() {
  const { internshipId } = useParams<{ internshipId: string }>()
  const userId = getStoredUserId()
  const [row, setRow] = useState<InternshipReadDto | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !internshipId) {
      setError(!userId ? 'Sign in required.' : 'Invalid id.')
      return
    }
    const idNum = Number(internshipId)
    if (Number.isNaN(idNum)) {
      setError('Invalid internship id.')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchInternshipById(userId, idNum)
        if (!cancelled) setRow(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId, internshipId])

  return (
    <div>
      <p>
        <Link to={ROUTES.internships}>← Back to list</Link>
      </p>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {row ? (
        <>
          <PageHeading title={`${row.companyName} — ${row.title}`} />
          <dl>
            <dt>Status</dt>
            <dd>{row.status}</dd>
            <dt>Deadline</dt>
            <dd>{row.deadlineDate ?? '—'}</dd>
            <dt>Applied</dt>
            <dd>{row.appliedDate ?? '—'}</dd>
            <dt>Link</dt>
            <dd>{row.link ? <a href={row.link}>{row.link}</a> : '—'}</dd>
            <dt>Notes</dt>
            <dd>{row.notes ?? '—'}</dd>
          </dl>
        </>
      ) : null}
    </div>
  )
}
