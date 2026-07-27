import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { formatRole } from '../../utils/formatStatus';

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
            Consultez rapidement les sections disponibles selon votre rôle dans
            le système de placement.
          </p>
        </div>

        {!isEtudiant && (
          <div className="dashboard-role-card">
            <span>Rôle actif</span>
            <strong>{formatRole(user?.role)}</strong>
          </div>
        )}
      </section>

      <section className="dashboard-grid">
        {canManageUsers && (
          <Link className="dashboard-card dashboard-link" to="/admin/users">
           
            <h2>Gestion des utilisateurs</h2>
            <p>
              Créer, modifier, activer ou désactiver les comptes de la
              plateforme.
            </p>
          </Link>
        )}

        

        {isSuperAdmin && (
          <Link className="dashboard-card dashboard-link" to="/admin/colleges">
            
            <h2>Gestion des cégeps</h2>
            <p>
              Créer, modifier ou désactiver les cégeps participants de la
              plateforme.
            </p>
          </Link>
        )}

        {(isSuperAdmin || isAdministrateur) && (
          <Link
            className="dashboard-card dashboard-link"
            to="/admin/domaines-etudes" >
            
            <h2>Domaines d’études</h2>
            <p>
              Ajouter, modifier ou désactiver les domaines d’études du cégep.
            </p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/profil-entreprise"
          >
            
            <h2>Profil entreprise</h2>
            <p>Compléter ou modifier les informations de votre entreprise.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link className="dashboard-card dashboard-link" to="/employeur/offres">
           
            <h2>Mes offres</h2>
            <p>Créer et modifier vos offres d’emploi ou de stage.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/candidatures"
          >
           
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
            to="/employeur/demandes-stage"
          >
            
            <h2>Demandes de stage</h2>
            <p>Consulter les demandes de stage des étudiants.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/employeur/offres-stage-directes"
          >
           
            <h2>Offres de stage directes</h2>
            <p>Proposer un stage directement à un étudiant.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link
            className="dashboard-card dashboard-link"
            to="/stages/confirmations"
          >
           
            <h2>Confirmations de stage</h2>
            <p>Confirmer ou refuser un stage afin d’officialiser le placement.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link className="dashboard-card dashboard-link" to="/notifications">
            
            <h2>Notifications</h2>
            <p>Être averti des nouvelles candidatures et réponses reçues.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/recherche-offres">
            
            <h2>Rechercher des offres</h2>
            <p>Trouver un emploi ou un stage et postuler.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/statut-offre">
           
            <h2>Statut d’une offre</h2>
            <p>Consulter les offres et leur statut actuel.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/mes-candidatures">
            
            <h2>Mes candidatures</h2>
            <p>Voir les offres auxquelles vous avez postulé.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/demande-stage">
            
            <h2>Demande de stage</h2>
            <p>Formuler une demande de stage dans un domaine d’études.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link
            className="dashboard-card dashboard-link"
            to="/offres-stage-recues"
          >
           
            <h2>Offres de stage reçues</h2>
            <p>Consulter les offres de stage directes et y répondre.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/mes-demarches">
            
            <h2>Mes démarches</h2>
            <p>Voir les suivis, appels ou rencontres ajoutés par le responsable.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/notifications">
            
            <h2>Notifications</h2>
            <p>Consulter les confirmations liées aux emplois et les avis reçus.</p>
          </Link>
        )}

        {isResponsableStage && (
          <Link
            className="dashboard-card dashboard-link"
            to="/responsable/suivi-etudiants"
          >
            
            <h2>Suivi des étudiants</h2>
            <p>Consulter les étudiants et suivre leurs démarches.</p>
          </Link>
        )}

         {isResponsableStage && (
          <Link
            className="dashboard-card dashboard-link"
            to="/responsable/recommandations"
          >
            
            <h2>Recommandation</h2>
            <p>Rédiger ou consulter les recommandations destinées aux étudiants.</p>
          </Link>
        )}

        {isResponsableStage && (
          <Link
            className="dashboard-card dashboard-link"
            to="/stages/confirmations"
          >
            
            <h2>Confirmations de stage</h2>
            <p>Confirmer ou refuser un stage afin d’officialiser le placement.</p>
          </Link>
        )}

       
      </section>
    </AppLayout>
  );
}
