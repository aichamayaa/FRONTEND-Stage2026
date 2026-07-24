import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_ROLES = ['SuperAdministrateur', 'Administrateur'];

export function DashboardPage() {
  const { user } = useAuth();

  const role = user?.role;

  const canManageUsers = ADMIN_ROLES.includes(role);
  const isSuperAdmin = role === 'SuperAdministrateur';
  const isAdministrateur = role === 'Administrateur';
  const isEmployeur = role === 'Employeur';
  const isEtudiant = role === 'Etudiant';
  const isResponsableStage = role === 'ResponsableStage';

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
              Créer, modifier, activer ou désactiver les comptes de la
              plateforme.
            </p>
          </Link>
        )}

        {canManageUsers && (
          <Link className="dashboard-card dashboard-link" to="/admin/roles">
            <span className="dashboard-card-number">02</span>
            <h2>Rôles et accès</h2>
            <p>Consulter les roles disponibles et verifier les acces.</p>
          </Link>
        )}

        {isSuperAdmin && (
          <Link className="dashboard-card dashboard-link" to="/admin/colleges">
            <span className="dashboard-card-number">03</span>
            <h2>Gestion des cégeps</h2>
            <p>
              Créer, modifier ou désactiver les cegeps participants de la
              plateforme.
            </p>
          </Link>
        )}

        {(isSuperAdmin || isAdministrateur) && (
          <Link
            className="dashboard-card dashboard-link"
            to="/admin/domaines-etudes"
          >
            <span className="dashboard-card-number">04</span>
            <h2>Domaines d’études</h2>
            <p>
              Ajouter, modifier ou désactiver les domaines d’études du cegep.
            </p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/profil-entreprise"
          >
            <span className="dashboard-card-number">05</span>
            <h2>Profil entreprise</h2>
            <p>Completer ou modifier les informations de votre entreprise.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link className="dashboard-card dashboard-link" to="/employeur/offres">
            <span className="dashboard-card-number">06</span>
            <h2>Mes offres</h2>
            <p>Creer et modifier vos offres d'emploi ou de stage.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/candidatures"
          >
            <span className="dashboard-card-number">07</span>
            <h2>Candidatures reçues</h2>
            <p>
              Consulter les candidats, changer leur statut et voir les
              documents.
            </p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/candidatures-domaine"
          >
            <span className="dashboard-card-number">08</span>
            <h2>Candidatures par domaine</h2>
            <p>Consulter les candidatures reçues filtrées par domaine.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/demandes-stage"
          >
            <span className="dashboard-card-number">09</span>
            <h2>Demandes de stage reçues</h2>
            <p>Consulter les demandes de stage des étudiants.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/offres-stage-directes"
          >
            <span className="dashboard-card-number">10</span>
            <h2>Offres de stage directes</h2>
            <p>Proposer un stage directement à un étudiant.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/stages/confirmations"
          >
            <span className="dashboard-card-number">11</span>
            <h2>Confirmations de stage</h2>
            <p>Confirmer ou refuser un stage afin d'officialiser le placement.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link className="dashboard-card dashboard-link" to="/notifications">
            <span className="dashboard-card-number">12</span>
            <h2>Notifications</h2>
            <p>Être averti des nouvelles candidatures et réponses reçues.</p>
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
            <p>Consulter les offres et leur statut actuel.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/mes-candidatures">
            <span className="dashboard-card-number">C</span>
            <h2>Mes candidatures</h2>
            <p>Voir les offres auxquelles vous avez postule.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/demande-stage">
            <span className="dashboard-card-number">D</span>
            <h2>Demande de stage</h2>
            <p>Formuler une demande de stage dans un domaine d’études.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link
            className="dashboard-card dashboard-link"
            to="/offres-stage-recues"
          >
            <span className="dashboard-card-number">E</span>
            <h2>Offres de stage reçues</h2>
            <p>Consulter les offres de stage directes et y repondre.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/mes-demarches">
            <span className="dashboard-card-number">F</span>
            <h2>Mes démarches</h2>
            <p>Voir les suivis, appels ou rencontres ajoutes par le responsable.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/notifications">
            <span className="dashboard-card-number">G</span>
            <h2>Notifications</h2>
            <p>Consulter les confirmations liées aux emplois et les avis reçus.</p>
          </Link>
        )}

        {isResponsableStage && (
          <Link
            className="dashboard-card dashboard-link"
            to="/responsable/suivi-etudiants"
          >
            <span className="dashboard-card-number">S1</span>
            <h2>Suivi des étudiants</h2>
            <p>Consulter les etudiants et suivre leurs demarches.</p>
          </Link>
        )}

        {isResponsableStage && (
          <Link
            className="dashboard-card dashboard-link"
            to="/stages/confirmations"
          >
            <span className="dashboard-card-number">S2</span>
            <h2>Confirmations de stage</h2>
            <p>Confirmer ou refuser un stage afin d'officialiser le placement.</p>
          </Link>
        )}

        <article className="dashboard-card">
          <span className="dashboard-card-number">?</span>
          <h2>Profil connecté</h2>
          <p>Vérifier les informations retournées par le token de connexion.</p>
        </article>
      </section>
    </AppLayout>
  );
}
