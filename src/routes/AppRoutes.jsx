import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { NotFoundPage } from '../pages/shared/NotFoundPage';
import { RechercheOffresPage } from '../pages/etudiant/RechercheOffresPage';
import { TestPostulerPage } from '../pages/etudiant/TestPostulerPage';
import { StatutOffrePage } from '../pages/etudiant/StatutOffrePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recherche-offres" element={<RechercheOffresPage />} />
      <Route path="/test-postuler" element={<TestPostulerPage />} />
      <Route path="/statut-offre" element={<StatutOffrePage />} />
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
