import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { RolesPage } from '../pages/admin/RolesPage';
import { CollegesPage } from '../pages/admin/CollegesPage';
import { DomainesEtudesPage } from '../pages/admin/DomainesEtudesPage';
import { OffresEmployeurPage } from '../pages/employeur/OffresEmployeurPage';
import { CandidaturesRecuesPage } from '../pages/employeur/CandidaturesRecuesPage';
import { ProfilEntreprisePage } from '../pages/employeur/ProfilEntreprisePage';
import { RechercheOffresPage } from '../pages/etudiant/RechercheOffresPage';
import { StatutOffrePage } from '../pages/etudiant/StatutOffrePage';
import { MesCandidaturesPage } from '../pages/etudiant/MesCandidaturesPage';
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

            {/* US-04 - Gestion des domaines d'�tudes */}
            <Route
                path="/admin/domaines-etudes"
                element={
                    <ProtectedRoute roles={['SuperAdministrateur', 'Administrateur']}>
                        <DomainesEtudesPage />
                    </ProtectedRoute>
                }
            />

            {/* US-05 - Gestion des colleges */}
            <Route
                path="/admin/colleges"
                element={
                    <ProtectedRoute roles={['SuperAdministrateur', 'Administrateur']}>
                        <CollegesPage />
                    </ProtectedRoute>
                }
            />

            {/* US-06 - Profil entreprise employeur */}
            <Route
                path="/employeur/profil-entreprise"
                element={
                    <ProtectedRoute roles={['Employeur']}>
                        <ProfilEntreprisePage />
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

      <Route
        path="/employeur/candidatures"
        element={
          <ProtectedRoute roles={['Employeur', 'Administrateur', 'SuperAdministrateur']}>
            <CandidaturesRecuesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recherche-offres"
        element={
          <ProtectedRoute>
            <RechercheOffresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/statut-offre"
        element={
          <ProtectedRoute>
            <StatutOffrePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mes-candidatures"
        element={
          <ProtectedRoute>
            <MesCandidaturesPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
