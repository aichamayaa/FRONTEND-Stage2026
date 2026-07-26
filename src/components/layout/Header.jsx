import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatRole } from '../../utils/formatStatus';

const DEFAULT_LOGO = '/images/GeraldGodin_Logo_COULEUR@2x.png';

export function Header() {
  const { user, collegeTheme, logout } = useAuth();
  const role = user?.role;

  const logoUrl = collegeTheme?.logoUrl || DEFAULT_LOGO;
  const nomCollege = collegeTheme?.nom || 'Cégep Gérald-Godin';

  const navigationItems = [
    {
      label: 'Tableau de bord',
      to: '/',
      roles: ['SuperAdministrateur', 'Administrateur', 'Employeur', 'Etudiant', 'ResponsableStage'],
    },
    {
      label: 'Gestion des utilisateurs',
      to: '/admin/users',
      roles: ['SuperAdministrateur', 'Administrateur'],
    },
  
    {
      label: 'Gestion des cégeps',
      to: '/admin/colleges',
      roles: ['SuperAdministrateur'],
    },
    {
      label: 'Domaines d’études',
      to: '/admin/domaines-etudes',
      roles: ['SuperAdministrateur', 'Administrateur'],
    },
    {
      label: 'Profil entreprise',
      to: '/employeur/profil-entreprise',
      roles: ['Employeur'],
    },
    {
      label: 'Mes offres',
      to: '/employeur/offres',
      roles: ['Employeur'],
    },
    {
      label: 'Candidatures reçues',
      to: '/employeur/candidatures',
      roles: ['Employeur'],
    },
    {
      label: 'Candidatures par domaine',
      to: '/employeur/candidatures-domaine',
      roles: ['Employeur'],
    },
    {
      label: 'Demandes de stage reçues',
      to: '/employeur/demandes-stage',
      roles: ['Employeur'],
    },
    {
      label: 'Offres de stage directes',
      to: '/employeur/offres-stage-directes',
      roles: ['Employeur'],
    },
    {
      label: 'Rechercher des offres',
      to: '/recherche-offres',
      roles: ['Etudiant'],
    },
    {
      label: "Statut d'une offre",
      to: '/statut-offre',
      roles: ['Etudiant'],
    },
    {
      label: 'Mes candidatures',
      to: '/mes-candidatures',
      roles: ['Etudiant'],
    },
    {
      label: 'Demande de stage',
      to: '/demande-stage',
      roles: ['Etudiant'],
    },
    {
      label: 'Offres de stage reçues',
      to: '/offres-stage-recues',
      roles: ['Etudiant'],
    },
    {
      label: 'Mes démarches',
      to: '/mes-demarches',
      roles: ['Etudiant'],
    },
    {
      label: 'Suivi des étudiants',
      to: '/responsable/suivi-etudiants',
      roles: ['ResponsableStage'],
    },
    {
      label: 'Confirmations de stage',
      to: '/stages/confirmations',
      roles: ['Employeur', 'ResponsableStage'],
    },
    {
      label: 'Notifications',
      to: '/notifications',
      roles: ['Employeur', 'Etudiant'],
    },
  ];

  const visibleNavigationItems = navigationItems.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="header-brand">
          <img
            className="header-logo"
            src={logoUrl}
            alt={nomCollege}
          />

          <div>
            <strong>Système de placement</strong>
            <span>{nomCollege}</span>
          </div>
        </div>

        <div className="header-actions">
          {user && (
            <span className="header-user">
              {user.prenom} - {formatRole(user.role)}
            </span>
          )}

          {user && (
            <button type="button" onClick={logout}>
              Déconnexion
            </button>
          )}
        </div>
      </div>

      {user && visibleNavigationItems.length > 0 && (
        <nav className="app-nav" aria-label="Navigation principale">
          {visibleNavigationItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? 'app-nav-link app-nav-link-active' : 'app-nav-link'
              }
              to={item.to}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
