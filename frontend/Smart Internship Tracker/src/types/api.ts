/** Aligns with backend InternshipReadDto / create / update shapes. */

export interface InternshipReadDto {
  internshipId: number
  userId: string
  companyName: string
  title: string
  link: string | null
  status: string
  deadlineDate: string | null
  appliedDate: string | null
  notes: string | null
  createdAt: string
}

export interface InternshipCreateDto {
  companyName: string
  title: string
  link?: string | null
  status: string
  deadlineDate?: string | null
  appliedDate?: string | null
  notes?: string | null
}

export interface InternshipUpdateDto extends InternshipCreateDto {}

export interface AuthResponse {
  token: string
  expiresAtUtc: string
  userId: string
  email: string
}
