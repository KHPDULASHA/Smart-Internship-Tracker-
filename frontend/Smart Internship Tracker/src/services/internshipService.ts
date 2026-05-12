/**
 * Internship API — Axios implementation.
 * Re-exports use the same names as the legacy fetch module for drop-in compatibility.
 */
export {
  getInternships as fetchInternships,
  getInternshipById as fetchInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} from './internshipAxios'
