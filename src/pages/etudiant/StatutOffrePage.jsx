import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { OffreTable } from '../../components/offres/OffreTable';
import { getOffres } from '../../services/offreService';

export function StatutOffrePage() {
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getOffres()
      .then(setOffres)
      .catch(() => setErreur('Impossible de récupérer les offres.'))
      .finally(() => setChargement(false));
  }, []);

  return (
    <AppLayout>
      <section className="dashboard-hero">
        <div>
          <p className="page-kicker">Offres</p>
          <h1>Statut des offres</h1>
          <p>Consultez toutes les offres et leur statut actuel.</p>
        </div>
      </section>

      {chargement && <p>Chargement...</p>}
      {erreur && <p className="form-error">{erreur}</p>}
      {!chargement && !erreur && (
        <OffreTable offres={offres} isEmployeur={false} onVoir={() => {}} />
      )}
    </AppLayout>
  );
}
