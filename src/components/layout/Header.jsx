import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <strong>Systeme de placement Cegep</strong>
      {user && (
        <button type="button" onClick={logout}>
          Deconnexion
        </button>
      )}
    </header>
  );
}
