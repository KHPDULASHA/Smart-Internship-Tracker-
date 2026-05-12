import { Link, useNavigate } from 'react-router-dom'
import { InternshipApplicationForm } from '../components/internships/InternshipApplicationForm'
import { PageHeading } from '../components/common/PageHeading'
import { ROUTES } from '../constants/routes'
import { getStoredUserId } from '../services/authService'

export default function InternshipNewPage() {
  const navigate = useNavigate()
  const userId = getStoredUserId()

  if (!userId) {
    return (
      <div>
        <p>
          Please <Link to={ROUTES.login}>log in</Link> to add an internship.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p>
        <Link to={ROUTES.internships}>← Internships</Link>
      </p>
      <PageHeading title="Add internship" subtitle="Create a new application record." />
      <InternshipApplicationForm
        userId={userId}
        onSuccess={(created) => {
          if (created) {
            navigate(ROUTES.internshipDetail(created.internshipId), { replace: true })
          } else {
            navigate(ROUTES.internships)
          }
        }}
        onCancel={() => navigate(ROUTES.internships)}
      />
    </div>
  )
}
