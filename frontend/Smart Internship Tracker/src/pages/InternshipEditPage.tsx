import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeading } from '../components/common/PageHeading'
import { ROUTES } from '../constants/routes'
import { fetchInternshipById, updateInternship } from '../services/internshipService'
import { getStoredUserId } from '../services/authService'
import type { InternshipReadDto, InternshipUpdateDto } from '../types/api'

function toInputDate(iso: string | null): string {
  if (!iso) return ''
  return iso.length >= 10 ? iso.slice(0, 10) : iso
}

export default function InternshipEditPage() {
  const { internshipId } = useParams<{ internshipId: string }>()
  const navigate = useNavigate()
  const userId = getStoredUserId()
  const idNum = internshipId ? Number(internshipId) : NaN

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<InternshipUpdateDto>({
    companyName: '',
    title: '',
    link: '',
    status: '',
    deadlineDate: null,
    appliedDate: null,
    notes: '',
  })

  useEffect(() => {
    if (!userId || Number.isNaN(idNum)) {
      setLoading(false)
      setError(!userId ? 'Sign in required.' : 'Invalid internship id.')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const row: InternshipReadDto = await fetchInternshipById(userId, idNum)
        if (cancelled) return
        setForm({
          companyName: row.companyName,
          title: row.title,
          link: row.link ?? '',
          status: row.status,
          deadlineDate: row.deadlineDate,
          appliedDate: row.appliedDate,
          notes: row.notes ?? '',
        })
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!userId || Number.isNaN(idNum)) return
    setSaving(true)
    setError(null)
    try {
      const payload: InternshipUpdateDto = {
        ...form,
        link: form.link || null,
        notes: form.notes || null,
        deadlineDate: form.deadlineDate || null,
        appliedDate: form.appliedDate || null,
      }
      await updateInternship(userId, idNum, payload)
      navigate(ROUTES.internshipDetail(idNum), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading…</p>

  return (
    <div>
      <p>
        <Link to={ROUTES.internships}>← Internships</Link>
      </p>
      <PageHeading title="Edit internship" />
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <form onSubmit={onSubmit} style={{ maxWidth: 480 }}>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Company
          <input
            required
            value={form.companyName}
            onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Status
          <input
            required
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Link
          <input
            type="url"
            value={form.link ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Deadline
          <input
            type="date"
            value={toInputDate(form.deadlineDate ?? null)}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                deadlineDate: e.target.value || null,
              }))
            }
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Applied
          <input
            type="date"
            value={toInputDate(form.appliedDate ?? null)}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                appliedDate: e.target.value || null,
              }))
            }
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          Notes
          <textarea
            value={form.notes ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={4}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          style={{ marginLeft: '0.5rem' }}
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  )
}
