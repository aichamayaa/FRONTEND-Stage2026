import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_ROLES = ['SuperAdministrateur', 'Administrateur'];

export function DashboardPage() {
  const { user } = useAuth();
  const canManageUsers = ADMIN_ROLES.includes(user?.role);

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

        {canManageUsers && (
          <Link className="dashboard-card dashboard-link" to="/admin/roles">
            <span className="dashboard-card-number">02</span>
            <h2>Roles et acces</h2>
            <p>
              Consulter les roles disponibles et verifier les acces associes.
            </p>
          </Link>
        )}

        <article className="dashboard-card">
          <span className="dashboard-card-number">03</span>
          <h2>Profil connecte</h2>
          <p>
            Verifier les informations retournees par le token de connexion.
          </p>
        </article>
      </section>
    </AppLayout>
  );
}
