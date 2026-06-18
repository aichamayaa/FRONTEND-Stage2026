import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <h1>Tableau de bord</h1>
      <p>Bienvenue {user?.prenom}.</p>
    </AppLayout>
  );
}
