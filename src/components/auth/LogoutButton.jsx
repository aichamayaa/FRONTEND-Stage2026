import { useAuth } from '../../hooks/useAuth';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button type="button" onClick={logout}>
      Déconnexion
    </button>
  );
}
