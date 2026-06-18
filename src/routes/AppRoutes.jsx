import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { NotFoundPage } from '../pages/shared/NotFoundPage';
import { RechercheOffresPage } from '../pages/etudiant/RechercheOffresPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recherche-offres" element={<RechercheOffresPage />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
