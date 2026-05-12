/**
 * Central route paths for links and programmatic navigation.
 */
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  internships: '/internships',
  internshipNew: '/internships/new',
  internshipDetail: (internshipId: string | number) => `/internships/${internshipId}`,
  internshipEdit: (internshipId: string | number) => `/internships/${internshipId}/edit`,
  skills: '/skills',
} as const
