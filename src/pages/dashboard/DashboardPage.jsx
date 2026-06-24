import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <h1>Tableau de bord</h1>
      <p>Bienvenue {user?.prenom}.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/test-postuler">
          <button type="button">Postuler</button>
        </Link>
        <Link to="/recherche-offres">
          <button type="button">Rechercher des offres</button>
        </Link>
        <Link to="/statut-offre">
          <button type="button">Statut d'une offre</button>
        </Link>
      </div>
    </AppLayout>
  );
}
