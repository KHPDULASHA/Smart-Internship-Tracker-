import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import AuthLayout from '../components/layout/AuthLayout'
import MainLayout from '../components/layout/MainLayout'
import DashboardPage from '../pages/DashboardPage'
import HomePage from '../pages/HomePage'
import InternshipDetailPage from '../pages/InternshipDetailPage'
import InternshipEditPage from '../pages/InternshipEditPage'
import InternshipNewPage from '../pages/InternshipNewPage'
import InternshipsPage from '../pages/InternshipsPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import RegisterPage from '../pages/RegisterPage'
import SkillsPage from '../pages/SkillsPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.internships} element={<InternshipsPage />} />
        <Route path={ROUTES.internshipNew} element={<InternshipNewPage />} />
        <Route path="/internships/:internshipId/edit" element={<InternshipEditPage />} />
        <Route path="/internships/:internshipId" element={<InternshipDetailPage />} />
        <Route path={ROUTES.skills} element={<SkillsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
