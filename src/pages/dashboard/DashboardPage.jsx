import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_ROLES = ['SuperAdministrateur', 'Administrateur'];
const EMPLOYEUR_ROLES = ['Employeur', 'Administrateur', 'SuperAdministrateur'];

export function DashboardPage() {
  const { user } = useAuth();
  const canManageUsers = ADMIN_ROLES.includes(user?.role);
  const canManageOffres = EMPLOYEUR_ROLES.includes(user?.role);
  const isEtudiant = user?.role === 'Etudiant';
  const isSuperAdmin = user?.role === "SuperAdministrateur";
  const isEmployeur = user?.role === 'Employeur';

  return (
    <AppLayout>
      <section className="dashboard-hero">
        <div>
          <p className="page-kicker">Tableau de bord</p>
          <h1>Bienvenue, {user?.prenom}</h1>
          <p>
            Consultez rapidement les sections disponibles selon votre role dans
            le systeme de placement.
          </p>
        </div>

        <div className="dashboard-role-card">
          <span>Role actif</span>
          <strong>{user?.role}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        {canManageUsers && (
          <Link className="dashboard-card dashboard-link" to="/admin/users">
            <span className="dashboard-card-number">01</span>
            <h2>Gestion des utilisateurs</h2>
            <p>
              Creer, modifier, activer ou desactiver les comptes de la
              plateforme.
            </p>
          </Link>
        )}

            {isSuperAdmin && (
          <Link className="dashboard-card dashboard-link" to="/admin/colleges">
            <span className="dashboard-card-number">07</span>
            <h2>Gestion des cégeps</h2>
            <p>
              Créer, modifier ou désactiver les cégeps participants de la
              plateforme.
            </p>
          </Link>
        )}
        {canManageUsers && (
          <Link
            className="dashboard-card dashboard-link"
            to="/admin/domaines-etudes"
          >
            <span className="dashboard-card-number">08</span>
            <h2>Domaines d'études</h2>
            <p>
              Ajouter, modifier ou désactiver les domaines d'études du cégep.
            </p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/profil-entreprise"
          >
            <span className="dashboard-card-number">09</span>
            <h2>Profil entreprise</h2>
            <p>Compléter ou modifier les informations de votre entreprise.</p>
          </Link>
        )}

   

        <article className="dashboard-card">
          <span className="dashboard-card-number">03</span>
          <h2>Profil connecte</h2>
          <p>
            Verifier les informations retournees par le token de connexion.
          </p>
        </article>

        {canManageOffres && (
          <Link className="dashboard-card dashboard-link" to="/employeur/offres">
            <span className="dashboard-card-number">04</span>
            <h2>Mes offres</h2>
            <p>
              Creer et modifier les offres d'emploi ou de stage publiees.
            </p>
          </Link>
        )}

        {canManageOffres && (
          <Link className="dashboard-card dashboard-link" to="/employeur/offres">
            <span className="dashboard-card-number">06</span>
            <h2>Créer une offre</h2>
            <p>Publier une nouvelle offre d'emploi ou de stage.</p>
          </Link>
        )}

        {canManageOffres && (
          <Link className="dashboard-card dashboard-link" to="/employeur/candidatures">
            <span className="dashboard-card-number">05</span>
            <h2>Candidatures recues</h2>
            <p>
              Consulter les candidats, changer leur statut et voir les documents.
            </p>
          </Link>
        )}

        {canManageOffres && (
          <Link className="dashboard-card dashboard-link" to="/employeur/candidatures-domaine">
            <span className="dashboard-card-number">10</span>
            <h2>Candidatures par domaine</h2>
            <p>Consulter les candidatures reçues filtrées par domaine d'études.</p>
          </Link>
        )}

        {canManageOffres && (
          <Link className="dashboard-card dashboard-link" to="/employeur/demandes-stage">
            <span className="dashboard-card-number">11</span>
            <h2>Demandes de stage reçues</h2>
            <p>Consulter les demandes de stage des étudiants par domaine.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/recherche-offres">
            <span className="dashboard-card-number">A</span>
            <h2>Rechercher des offres</h2>
            <p>Trouver un emploi ou un stage et postuler.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/statut-offre">
            <span className="dashboard-card-number">B</span>
            <h2>Statut d'une offre</h2>
            <p>Consulter toutes les offres et leur statut actuel.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/mes-candidatures">
            <span className="dashboard-card-number">C</span>
            <h2>Mes candidatures</h2>
            <p>Voir les offres auxquelles vous avez postulé et leur statut.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/demande-stage">
            <span className="dashboard-card-number">D</span>
            <h2>Demande de stage</h2>
            <p>Formuler une demande de stage dans un domaine d'études.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/offres-stage-recues">
            <span className="dashboard-card-number">E</span>
            <h2>Offres de stage reçues</h2>
            <p>Consulter les offres de stage directes et y répondre.</p>
          </Link>
        )}
      </section>
    </AppLayout>
  );
}
