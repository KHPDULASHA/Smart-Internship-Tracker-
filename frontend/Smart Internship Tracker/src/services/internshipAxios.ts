import type {
  InternshipCreateDto,
  InternshipReadDto,
  InternshipUpdateDto,
} from '../types/api'
import { api } from './axiosClient'

const internshipsUrl = (userId: string) => `/api/users/${userId}/internships`

/** GET all internships for a user */
export async function getInternships(userId: string): Promise<InternshipReadDto[]> {
  const { data } = await api.get<InternshipReadDto[]>(internshipsUrl(userId))
  return data
}

/** GET a single internship */
export async function getInternshipById(
  userId: string,
  internshipId: number,
): Promise<InternshipReadDto> {
  const { data } = await api.get<InternshipReadDto>(
    `${internshipsUrl(userId)}/${internshipId}`,
  )
  return data
}

/** POST create internship */
export async function createInternship(
  userId: string,
  body: InternshipCreateDto,
): Promise<InternshipReadDto> {
  const { data } = await api.post<InternshipReadDto>(internshipsUrl(userId), body)
  return data
}

/** PUT full update */
export async function updateInternship(
  userId: string,
  internshipId: number,
  body: InternshipUpdateDto,
): Promise<void> {
  await api.put(`${internshipsUrl(userId)}/${internshipId}`, body)
}

/** DELETE internship */
export async function deleteInternship(
  userId: string,
  internshipId: number,
): Promise<void> {
  await api.delete(`${internshipsUrl(userId)}/${internshipId}`)
}
