import type {
  InternshipCreateDto,
  InternshipReadDto,
  InternshipUpdateDto,
} from '../types/api'
import { apiDelete, apiGet, apiPost, apiPut } from './apiClient'

const internshipsPath = (userId: string) => `/api/users/${userId}/internships`

export function fetchInternships(userId: string): Promise<InternshipReadDto[]> {
  return apiGet<InternshipReadDto[]>(internshipsPath(userId))
}

export function fetchInternshipById(
  userId: string,
  internshipId: number,
): Promise<InternshipReadDto> {
  return apiGet<InternshipReadDto>(`${internshipsPath(userId)}/${internshipId}`)
}

export function createInternship(
  userId: string,
  dto: InternshipCreateDto,
): Promise<InternshipReadDto> {
  return apiPost<InternshipReadDto>(internshipsPath(userId), dto)
}

export function updateInternship(
  userId: string,
  internshipId: number,
  dto: InternshipUpdateDto,
): Promise<void> {
  return apiPut<void>(`${internshipsPath(userId)}/${internshipId}`, dto)
}

export function deleteInternship(userId: string, internshipId: number): Promise<void> {
  return apiDelete(`${internshipsPath(userId)}/${internshipId}`)
}
