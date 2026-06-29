import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { getMesCandidatures } from '../../services/candidatureService';
import { formatDate } from '../../utils/formatDate';

const STATUT_LABELS = {
  EnAttente: 'En attente',
  Vue: 'Vue',
  Acceptee: 'Acceptée',
  Refusee: 'Refusée'
};

const STATUT_BADGE = {
  EnAttente: 'badge-muted',
  Vue: 'badge-vue',
  Acceptee: 'badge-success',
  Refusee: 'badge-danger'
};

export function MesCandidaturesPage() {
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getMesCandidatures()
      .then(setCandidatures)
      .catch(() => setErreur('Impossible de récupérer vos candidatures.'))
      .finally(() => setChargement(false));
  }, []);

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Mes candidatures</h1>
        <p>Suivez les offres auxquelles vous avez postulé et leur statut.</p>
      </div>

      {chargement && <p>Chargement...</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}

      {!chargement && !erreur && candidatures.length === 0 && (
        <div className="empty-state">
          <h2>Aucune candidature</h2>
          <p>Vous n'avez postulé à aucune offre pour le moment.</p>
        </div>
      )}

      {!chargement && !erreur && candidatures.length > 0 && (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Offre</th>
                <th>Statut</th>
                <th>CV</th>
                <th>Lettre</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {candidatures.map((c) => (
                <tr key={c.idCandidature}>
                  <td>{c.titreOffre}</td>
                  <td>
                    <span className={`badge ${STATUT_BADGE[c.statut] ?? 'badge-muted'}`}>
                      {STATUT_LABELS[c.statut] ?? c.statut}
                    </span>
                  </td>
                  <td>{c.acv ? 'Oui' : 'Non'}</td>
                  <td>{c.aLettreMotivation ? 'Oui' : 'Non'}</td>
                  <td>{formatDate(c.dateCandidature)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
