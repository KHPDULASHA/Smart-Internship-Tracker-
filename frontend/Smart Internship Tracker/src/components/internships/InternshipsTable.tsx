import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { deleteInternship } from '../../services/internshipService'
import type { InternshipReadDto } from '../../types/api'

export type InternshipsTableProps = {
  userId: string
  internships: InternshipReadDto[]
  /** Called after a successful delete so the parent can refetch. */
  onChanged: () => void
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString()
}

export function InternshipsTable({ userId, internships, onChanged }: InternshipsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete(row: InternshipReadDto) {
    if (!window.confirm(`Delete application for “${row.companyName} — ${row.title}”?`)) return
    setDeleteError(null)
    setDeletingId(row.internshipId)
    try {
      await deleteInternship(userId, row.internshipId)
      onChanged()
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {deleteError ? (
        <p role="alert" style={{ color: 'crimson', marginBottom: '0.75rem' }}>
          {deleteError}
        </p>
      ) : null}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.95rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0.75rem' }}>Company</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Role</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Status</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Deadline</th>
              <th style={{ padding: '0.5rem 0.75rem', width: 1 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((row) => {
              const busy = deletingId === row.internshipId
              return (
                <tr key={row.internshipId} style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.companyName}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <Link to={ROUTES.internshipDetail(row.internshipId)}>{row.title}</Link>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.status}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{formatDate(row.deadlineDate)}</td>
                  <td style={{ padding: '0.6rem 0.75rem', whiteSpace: 'nowrap' }}>
                    <Link
                      to={ROUTES.internshipEdit(row.internshipId)}
                      aria-disabled={busy}
                      onClick={(e) => {
                        if (busy) e.preventDefault()
                      }}
                      style={{
                        marginRight: '0.75rem',
                        display: 'inline-block',
                        padding: '0.35rem 0.65rem',
                        border: '1px solid #888',
                        borderRadius: 4,
                        textDecoration: 'none',
                        color: 'inherit',
                        opacity: busy ? 0.55 : 1,
                        pointerEvents: busy ? 'none' : 'auto',
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleDelete(row)}
                    >
                      {busy ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
