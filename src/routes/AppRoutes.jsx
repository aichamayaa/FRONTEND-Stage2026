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
import { RechercheOffresPage } from '../pages/etudiant/RechercheOffresPage';
import { StatutOffrePage } from '../pages/etudiant/StatutOffrePage';
import { MesCandidaturesPage } from '../pages/etudiant/MesCandidaturesPage';

import { MesDemarchesPage } from '../pages/etudiant/MesDemarchesPage';
import { SuiviEtudiantsPage } from '../pages/responsable/SuiviEtudiantsPage';
import { ConfirmationsStagePage } from '../pages/responsable/ConfirmationsStagePage';

import { DemandeStagePage } from '../pages/etudiant/DemandeStagePage';
import { OffresStageRecuesPage } from '../pages/etudiant/OffresStageRecuesPage';
import { CandidaturesParDomainePage } from '../pages/employeur/CandidaturesParDomainePage';
import { DemandesStageRecuesPage } from '../pages/employeur/DemandesStageRecuesPage';

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

      <Route
        path="/demande-stage"
        element={
          <ProtectedRoute>
            <DemandeStagePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/offres-stage-recues"
        element={
          <ProtectedRoute>
            <OffresStageRecuesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/candidatures-domaine"
        element={
          <ProtectedRoute roles={['Employeur', 'Administrateur', 'SuperAdministrateur']}>
            <CandidaturesParDomainePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employeur/demandes-stage"
        element={
          <ProtectedRoute roles={['Employeur', 'Administrateur', 'SuperAdministrateur']}>
            <DemandesStageRecuesPage />
          </ProtectedRoute>
        }
      />

      {/* Ajout de la Route */}
      <Route
        path="/employeur/offres-stage-directes"
        element={
          <ProtectedRoute roles={['Employeur', 'Administrateur', 'SuperAdministrateur']}>
            <OffresStageDirectesPage />
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
          <ProtectedRoute roles={['SuperAdministrateur', 'Administrateur']}>
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
        path="/stages/confirmations"
        element={
          <ProtectedRoute roles={['ResponsableStage', 'Employeur']}>
            <ConfirmationsStagePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
