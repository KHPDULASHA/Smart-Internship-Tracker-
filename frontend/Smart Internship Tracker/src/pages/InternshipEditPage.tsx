import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { InternshipApplicationForm } from '../components/internships/InternshipApplicationForm'
import { PageHeading } from '../components/common/PageHeading'
import { ROUTES } from '../constants/routes'
import { fetchInternshipById } from '../services/internshipService'
import { getStoredUserId } from '../services/authService'
import type { InternshipCreateDto, InternshipReadDto } from '../types/api'

export default function InternshipEditPage() {
  const { internshipId } = useParams<{ internshipId: string }>()
  const navigate = useNavigate()
  const userId = getStoredUserId()
  const idNum = internshipId ? Number(internshipId) : NaN

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [row, setRow] = useState<InternshipReadDto | null>(null)

  useEffect(() => {
    if (!userId || Number.isNaN(idNum)) {
      setLoading(false)
      setError(!userId ? 'Sign in required.' : 'Invalid internship id.')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchInternshipById(userId, idNum)
        if (!cancelled) setRow(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId, idNum])

  const defaultValues = useMemo<Partial<InternshipCreateDto> | undefined>(() => {
    if (!row) return undefined
    return {
      companyName: row.companyName,
      title: row.title,
      link: row.link ?? '',
      status: row.status,
      deadlineDate: row.deadlineDate,
      appliedDate: row.appliedDate,
      notes: row.notes ?? '',
    }
  }, [row])

  if (!userId) {
    return (
      <p>
        Please <Link to={ROUTES.login}>log in</Link>.
      </p>
    )
  }

  if (loading) return <p>Loading…</p>

  if (error || !row) {
    return (
      <div>
        <p>
          <Link to={ROUTES.internships}>← Internships</Link>
        </p>
        {error ? <p style={{ color: 'crimson' }}>{error}</p> : <p>Not found.</p>}
      </div>
    )
  }

  return (
    <div>
      <p>
        <Link to={ROUTES.internships}>← Internships</Link>
      </p>
      <PageHeading title="Edit internship" />
      <InternshipApplicationForm
        userId={userId}
        internshipId={idNum}
        defaultValues={defaultValues}
        onSuccess={() => navigate(ROUTES.internshipDetail(idNum), { replace: true })}
        onCancel={() => navigate(-1)}
      />
    </div>
  )
}
