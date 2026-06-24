import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-brand">
        <img
          className="header-logo"
          src="/images/GeraldGodin_Logo_COULEUR@2x.png"
          alt="Cégep Gérald-Godin"
        />

        <div>
          <strong>Système de placement</strong>
          <span>Cégep Gérald-Godin</span>
        </div>
      </div>

      <div className="header-actions">
        {user && (
          <span className="header-user">
            {user.prenom} · {user.role}
          </span>
        )}

        {user && (
          <button type="button" onClick={logout}>
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}