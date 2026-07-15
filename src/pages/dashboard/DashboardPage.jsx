import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_ROLES = ['SuperAdministrateur', 'Administrateur'];

export function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;

  const canManageUsers = ADMIN_ROLES.includes(role);
  const isSuperAdmin = role === 'SuperAdministrateur';
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
            <p>Creer, modifier, activer ou desactiver les comptes de la plateforme.</p>
          </Link>
        )}

        {canManageUsers && (
          <Link className="dashboard-card dashboard-link" to="/admin/roles">
            <span className="dashboard-card-number">02</span>
            <h2>Roles et acces</h2>
            <p>Consulter les roles disponibles et verifier les acces associes.</p>
          </Link>
        )}

        {isSuperAdmin && (
          <Link className="dashboard-card dashboard-link" to="/admin/colleges">
            <span className="dashboard-card-number">07</span>
            <h2>Gestion des cegeps</h2>
            <p>Creer, modifier ou desactiver les cegeps participants.</p>
          </Link>
        )}

        {canManageUsers && (
          <Link className="dashboard-card dashboard-link" to="/admin/domaines-etudes">
            <span className="dashboard-card-number">08</span>
            <h2>Domaines d'etudes</h2>
            <p>Ajouter, modifier ou desactiver les domaines d'etudes du cegep.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link className="dashboard-card dashboard-link" to="/employeur/profil-entreprise">
            <span className="dashboard-card-number">09</span>
            <h2>Profil entreprise</h2>
            <p>Completer ou modifier les informations de votre entreprise.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link className="dashboard-card dashboard-link" to="/employeur/offres">
            <span className="dashboard-card-number">04</span>
            <h2>Mes offres</h2>
            <p>Creer et modifier vos offres d'emploi ou de stage.</p>
          </Link>
        )}

        {isEmployeur && (
          <Link className="dashboard-card dashboard-link" to="/employeur/candidatures">
            <span className="dashboard-card-number">05</span>
            <h2>Candidatures recues</h2>
            <p>Consulter les candidats, changer leur statut et voir les documents.</p>
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
          <Link className="dashboard-card dashboard-link" to="/mes-candidatures">
            <span className="dashboard-card-number">C</span>
            <h2>Mes candidatures</h2>
            <p>Voir les offres auxquelles vous avez postule et leur statut.</p>
          </Link>
        )}

        {isEtudiant && (
          <Link className="dashboard-card dashboard-link" to="/mes-demarches">
            <span className="dashboard-card-number">D</span>
            <h2>Mes demarches</h2>
            <p>Consulter les suivis, appels et rencontres partages.</p>
          </Link>
        )}

        {isResponsableStage && (
          <Link className="dashboard-card dashboard-link" to="/responsable/suivi-etudiants">
            <span className="dashboard-card-number">S2</span>
            <h2>Suivi des etudiants</h2>
            <p>Consulter les etudiants suivis et ajouter des demarches.</p>
          </Link>
        )}

        {(isResponsableStage || isEmployeur) && (
          <Link className="dashboard-card dashboard-link" to="/stages/confirmations">
            <span className="dashboard-card-number">S3</span>
            <h2>Confirmations de stage</h2>
            <p>Confirmer ou refuser un stage afin d'officialiser le placement.</p>
          </Link>
        )}

        <article className="dashboard-card">
          <span className="dashboard-card-number">03</span>
          <h2>Profil connecte</h2>
          <p>Verifier les informations retournees par le token de connexion.</p>
        </article>
      </section>
    </AppLayout>
  );
}
