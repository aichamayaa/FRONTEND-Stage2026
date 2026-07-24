import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DEFAULT_LOGO = '/images/GeraldGodin_Logo_COULEUR@2x.png';

export function Header() {
  const { user, collegeTheme, logout } = useAuth();
  const role = user?.role;

  const logoUrl = collegeTheme?.logoUrl || DEFAULT_LOGO;
  const nomCollege = collegeTheme?.nom || 'Cégep Gérald-Godin';

  const navigationItems = [
    {
      label: 'Dashboard',
      to: '/',
      roles: ['SuperAdministrateur', 'Administrateur', 'Employeur', 'Etudiant', 'ResponsableStage'],
    },
    {
      label: 'Utilisateurs',
      to: '/admin/users',
      roles: ['SuperAdministrateur', 'Administrateur'],
    },
  
    {
      label: 'Colleges',
      to: '/admin/colleges',
      roles: ['SuperAdministrateur'],
    },
    {
      label: 'Domaines',
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
      label: 'Rechercher',
      to: '/recherche-offres',
      roles: ['Etudiant'],
    },
    {
      label: 'Mes candidatures',
      to: '/mes-candidatures',
      roles: ['Etudiant'],
    },
    {
      label: 'Mes démarches',
      to: '/mes-demarches',
      roles: ['Etudiant'],
    },
    {
      label: 'Suivi étudiants',
      to: '/responsable/suivi-etudiants',
      roles: ['ResponsableStage'],
    },
    {
      label: 'Confirmations',
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
              {user.prenom} - {user.role}
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
