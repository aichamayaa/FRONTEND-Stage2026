import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { RolesPage } from '../pages/admin/RolesPage';
import { OffresEmployeurPage } from '../pages/employeur/OffresEmployeurPage';
import { NotFoundPage } from '../pages/shared/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['SuperAdministrateur', 'Administrateur']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute roles={['SuperAdministrateur', 'Administrateur']}>
            <RolesPage />
          </ProtectedRoute>
        }
      />

      {/* US-07 / US-08 / US-09 - CRUD offres employeur */}
      <Route
        path="/employeur/offres"
        element={
          <ProtectedRoute roles={['Employeur', 'Administrateur', 'SuperAdministrateur']}>
            <OffresEmployeurPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
