import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { RolesPage } from '../pages/admin/RolesPage';
import { CollegesPage } from '../pages/admin/CollegesPage';
import { DomainesEtudesPage } from '../pages/admin/DomainesEtudesPage';
import { OffresEmployeurPage } from '../pages/employeur/OffresEmployeurPage';
import { OffresStageDirectesPage } from '../pages/employeur/OffresStageDirectesPage';
import { CandidaturesRecuesPage } from '../pages/employeur/CandidaturesRecuesPage';
import { ProfilEntreprisePage } from '../pages/employeur/ProfilEntreprisePage';
import { DemandesStageRecuesPage } from '../pages/employeur/DemandesStageRecuesPage';
import { RecommandationsRecuesPage } from '../pages/employeur/RecommandationsRecuesPage';
import { RechercheOffresPage } from '../pages/etudiant/RechercheOffresPage';
import { StatutOffrePage } from '../pages/etudiant/StatutOffrePage';
import { MesCandidaturesPage } from '../pages/etudiant/MesCandidaturesPage';
import { DemandeStagePage } from '../pages/etudiant/DemandeStagePage';
import { OffresStageRecuesPage } from '../pages/etudiant/OffresStageRecuesPage';
import { MesDemarchesPage } from '../pages/etudiant/MesDemarchesPage';
import { SuiviEtudiantsPage } from '../pages/responsable/SuiviEtudiantsPage';
import { ConfirmationsStagePage } from '../pages/responsable/ConfirmationsStagePage';
import { NotificationsPage } from '../pages/shared/NotificationsPage';
import { RecommandationsPage } from '../pages/responsable/RecommandationsPage';
import { NotFoundPage } from '../pages/shared/NotFoundPage';

const ADMIN_ROLES = ['SuperAdministrateur', 'Administrateur'];

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
          <ProtectedRoute roles={ADMIN_ROLES}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute roles={ADMIN_ROLES}>
            <RolesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/colleges"
        element={
          <ProtectedRoute roles={['SuperAdministrateur']}>
            <CollegesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/domaines-etudes"
        element={
          <ProtectedRoute roles={ADMIN_ROLES}>
            <DomainesEtudesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/profil-entreprise"
        element={
          <ProtectedRoute roles={['Employeur']}>
            <ProfilEntreprisePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/offres"
        element={
          <ProtectedRoute roles={['Employeur']}>
            <OffresEmployeurPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/candidatures"
        element={
          <ProtectedRoute roles={['Employeur']}>
            <CandidaturesRecuesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/demandes-stage"
        element={
          <ProtectedRoute roles={['Employeur']}>
            <DemandesStageRecuesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/offres-stage-directes"
        element={
          <ProtectedRoute roles={['Employeur']}>
            <OffresStageDirectesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/recommandations-recues"
        element={
          <ProtectedRoute roles={['Employeur']}>
            <RecommandationsRecuesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recherche-offres"
        element={
          <ProtectedRoute roles={['Etudiant']}>
            <RechercheOffresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/statut-offre"
        element={
          <ProtectedRoute roles={['Etudiant']}>
            <StatutOffrePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mes-candidatures"
        element={
          <ProtectedRoute roles={['Etudiant']}>
            <MesCandidaturesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/demande-stage"
        element={
          <ProtectedRoute roles={['Etudiant']}>
            <DemandeStagePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/offres-stage-recues"
        element={
          <ProtectedRoute roles={['Etudiant']}>
            <OffresStageRecuesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mes-demarches"
        element={
          <ProtectedRoute roles={['Etudiant']}>
            <MesDemarchesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/responsable/suivi-etudiants"
        element={
          <ProtectedRoute roles={['ResponsableStage']}>
            <SuiviEtudiantsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/responsable/recommandations"
        element={
          <ProtectedRoute roles={['ResponsableStage']}>
            <RecommandationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stages/confirmations"
        element={
          <ProtectedRoute roles={['ResponsableStage', 'Employeur']}>
            <ConfirmationsStagePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute roles={['Employeur', 'Etudiant', 'ResponsableStage']}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}