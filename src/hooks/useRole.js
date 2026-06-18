import { useAuth } from './useAuth';

export function useRole(role) {
  const { user } = useAuth();
  return user?.role === role;
}
