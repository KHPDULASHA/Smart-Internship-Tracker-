import { type FormEvent, useEffect, useState } from 'react'
import type { InternshipCreateDto, InternshipReadDto } from '../../types/api'
import { getAxiosErrorMessage } from '../../services/axiosClient'
import { createInternship, updateInternship } from '../../services/internshipAxios'

const emptyForm: InternshipCreateDto = {
  companyName: '',
  title: '',
  link: '',
  status: 'Wishlist',
  deadlineDate: null,
  appliedDate: null,
  notes: '',
}

function toInputDate(value: string | null | undefined): string {
  if (!value) return ''
  return value.length >= 10 ? value.slice(0, 10) : value
}

function mergeDefaults(
  base: InternshipCreateDto,
  patch?: Partial<InternshipCreateDto>,
): InternshipCreateDto {
  if (!patch) return { ...base }
  return {
    companyName: patch.companyName ?? base.companyName,
    title: patch.title ?? base.title,
    link: patch.link !== undefined ? patch.link : base.link,
    status: patch.status ?? base.status,
    deadlineDate:
      patch.deadlineDate !== undefined ? patch.deadlineDate : base.deadlineDate,
    appliedDate:
      patch.appliedDate !== undefined ? patch.appliedDate : base.appliedDate,
    notes: patch.notes !== undefined ? patch.notes : base.notes,
  }
}

export type InternshipApplicationFormProps = {
  userId: string
  /** If set, submits PUT to update this internship; otherwise POST create */
  internshipId?: number
  /** Seed values (e.g. loaded row when editing) */
  defaultValues?: Partial<InternshipCreateDto>
  /** Create: receives created row; update: called with no argument */
  onSuccess?: (created?: InternshipReadDto) => void
  onCancel?: () => void
}

export function InternshipApplicationForm({
  userId,
  internshipId,
  defaultValues,
  onSuccess,
  onCancel,
}: InternshipApplicationFormProps) {
  const isUpdate = typeof internshipId === 'number' && !Number.isNaN(internshipId)
  const [form, setForm] = useState<InternshipCreateDto>(() =>
    mergeDefaults(emptyForm, defaultValues),
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm(mergeDefaults(emptyForm, defaultValues))
  }, [defaultValues, internshipId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const payload: InternshipCreateDto = {
      ...form,
      companyName: form.companyName.trim(),
      title: form.title.trim(),
      status: form.status.trim(),
      link: form.link?.toString().trim() || null,
      notes: form.notes?.toString().trim() || null,
      deadlineDate: form.deadlineDate || null,
      appliedDate: form.appliedDate || null,
    }
    try {
      if (isUpdate) {
        await updateInternship(userId, internshipId, payload)
        onSuccess?.()
      } else {
        const created = await createInternship(userId, payload)
        onSuccess?.(created)
      }
    } catch (err) {
      setError(getAxiosErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      {error ? (
        <p role="alert" style={{ color: 'crimson', marginBottom: '0.75rem' }}>
          {error}
        </p>
      ) : null}
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
            setForm((f) => ({ ...f, deadlineDate: e.target.value || null }))
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
            setForm((f) => ({ ...f, appliedDate: e.target.value || null }))
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
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : isUpdate ? 'Update application' : 'Add application'}
      </button>
      {onCancel ? (
        <button
          type="button"
          style={{ marginLeft: '0.5rem' }}
          disabled={submitting}
          onClick={onCancel}
        >
          Cancel
        </button>
      ) : null}
    </form>
  )
}
