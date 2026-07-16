import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { getDomainesEtudes } from '../../services/domaineEtudeService';
import { getCandidaturesParDomaine } from '../../services/candidatureService';
import { formatDate } from '../../utils/formatDate';

const STATUT_LABELS = {
  EnAttente: 'En attente',
  Vue: 'Vue',
  Acceptee: 'Acceptée',
  Refusee: 'Refusée',
  Retiree: 'Retirée'
};

const STATUT_BADGE = {
  EnAttente: 'badge-muted',
  Vue: 'badge-vue',
  Acceptee: 'badge-success',
  Refusee: 'badge-danger',
  Retiree: 'badge-muted'
};

export function CandidaturesParDomainePage() {
  const [domaines, setDomaines] = useState([]);
  const [idDomaine, setIdDomaine] = useState('');
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState(false);

  useEffect(() => {
    getDomainesEtudes()
      .then(setDomaines)
      .catch(() => setErreur('Impossible de charger les domaines.'));
  }, []);

  async function handleChange(value) {
    setIdDomaine(value);
    if (!value) {
      setCandidatures([]);
      setRecherche(false);
      return;
    }
    setChargement(true);
    setErreur(null);
    try {
      const data = await getCandidaturesParDomaine(value);
      setCandidatures(data);
    } catch {
      setErreur('Impossible de charger les candidatures.');
    } finally {
      setChargement(false);
      setRecherche(true);
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Employeur</p>
        <h1>Candidatures par domaine</h1>
        <p>Consultez les candidatures reçues sur vos offres, filtrées par domaine d'études.</p>
      </div>

      <div className="panel">
        <label className="offre-filters__label">
          Domaine d'études
          <select
            className="offre-filters__select"
            value={idDomaine}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value="">-- Choisir un domaine --</option>
            {domaines.map((d) => (
              <option key={d.idDomaine} value={d.idDomaine}>
                {d.nom}
              </option>
            ))}
          </select>
        </label>
      </div>

      {chargement && <p>Chargement...</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}
      {recherche && !chargement && candidatures.length === 0 && (
        <p className="notice">Aucune candidature pour ce domaine.</p>
      )}

      {candidatures.length > 0 && (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Candidat</th>
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
                  <td>{c.prenomEtudiant} {c.nomEtudiant}</td>
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
