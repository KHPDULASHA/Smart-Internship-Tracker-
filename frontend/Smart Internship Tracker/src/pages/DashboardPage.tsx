import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InternshipStatsCharts } from '../components/dashboard/InternshipStatsCharts'
import { PageHeading } from '../components/common/PageHeading'
import { ROUTES } from '../constants/routes'
import { fetchInternships } from '../services/internshipService'
import { getStoredUserId } from '../services/authService'
import type { InternshipReadDto } from '../types/api'
import {
  countApplicationsByStatus,
  countUpcomingDeadlines,
} from '../utils/internshipStats'

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#fafafa',
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>{value}</div>
    </div>
  )
}

export default function DashboardPage() {
  const userId = getStoredUserId()
  const [items, setItems] = useState<InternshipReadDto[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) {
      setItems([])
      return
    }
    setError(null)
    try {
      const data = await fetchInternships(userId)
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load internships')
      setItems([])
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  const statusCounts = useMemo(
    () => (items ? countApplicationsByStatus(items) : []),
    [items],
  )

  const chartLabels = useMemo(() => statusCounts.map((s) => s.status), [statusCounts])
  const chartValues = useMemo(() => statusCounts.map((s) => s.count), [statusCounts])

  const total = items?.length ?? 0
  const uniqueStatuses = statusCounts.length
  const upcoming14 = items ? countUpcomingDeadlines(items, 14) : 0

  if (!userId) {
    return (
      <div>
        <PageHeading title="Dashboard" subtitle="Application statistics" />
        <p>
          Please <Link to={ROUTES.login}>log in</Link> to view your dashboard.
        </p>
      </div>
    )
  }

  if (items === null && !error) {
    return (
      <div>
        <PageHeading title="Dashboard" subtitle="Application statistics" />
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeading
        title="Dashboard"
        subtitle="Internship application statistics from your tracked roles."
      />

      {error ? <p style={{ color: 'crimson', marginBottom: '1rem' }}>{error}</p> : null}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard label="Total applications" value={total} />
        <StatCard label="Distinct statuses" value={uniqueStatuses} />
        <StatCard label="Deadlines (next 14 days)" value={upcoming14} />
      </div>

      <p style={{ marginBottom: 0 }}>
        <Link to={ROUTES.internships}>Manage internships</Link>
        {' · '}
        <Link to={ROUTES.internshipNew}>Add new</Link>
      </p>

      <InternshipStatsCharts labels={chartLabels} values={chartValues} />
    </div>
  )
}
