import type { InternshipReadDto } from '../types/api'

export type StatusCount = { status: string; count: number }

/** Count applications per status (sorted by count desc). */
export function countApplicationsByStatus(items: InternshipReadDto[]): StatusCount[] {
  const map = new Map<string, number>()
  for (const row of items) {
    const key = row.status?.trim() || 'Unknown'
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count || a.status.localeCompare(b.status))
}

/** Applications with a deadline in the next `withinDays` days (inclusive of today). */
export function countUpcomingDeadlines(
  items: InternshipReadDto[],
  withinDays: number,
): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(today)
  end.setDate(end.getDate() + withinDays)
  let n = 0
  for (const row of items) {
    if (!row.deadlineDate) continue
    const d = new Date(row.deadlineDate.slice(0, 10))
    if (Number.isNaN(d.getTime())) continue
    if (d >= today && d <= end) n += 1
  }
  return n
}
