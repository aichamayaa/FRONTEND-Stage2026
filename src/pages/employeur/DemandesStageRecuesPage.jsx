import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { getDomainesEtudes } from '../../services/domaineEtudeService';
import { getDemandesParDomaine } from '../../services/demandeStageService';
import { formatDate } from '../../utils/formatDate';

const STATUT_LABELS = {
  Ouverte: 'Ouverte',
  Pourvue: 'Pourvue',
  Annulee: 'Annulée'
};

const STATUT_BADGE = {
  Ouverte: 'badge-success',
  Pourvue: 'badge-muted',
  Annulee: 'badge-danger'
};

export function DemandesStageRecuesPage() {
  const [domaines, setDomaines] = useState([]);
  const [idDomaine, setIdDomaine] = useState('');
  const [demandes, setDemandes] = useState([]);
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
      setDemandes([]);
      setRecherche(false);
      return;
    }
    setChargement(true);
    setErreur(null);
    try {
      const data = await getDemandesParDomaine(value);
      setDemandes(data);
    } catch {
      setErreur('Impossible de charger les demandes.');
    } finally {
      setChargement(false);
      setRecherche(true);
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Employeur</p>
        <h1>Demandes de stage</h1>
        <p>Consultez les demandes de stage formulées par les étudiants, par domaine d’études.</p>
      </div>

      <div className="panel">
        <label className="offre-filters__label">
          Domaine d’études
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
      {recherche && !chargement && demandes.length === 0 && (
        <p className="notice">Aucune demande pour ce domaine.</p>
      )}

      {demandes.length > 0 && (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Collège</th>
                <th>Période</th>
                <th>Compétences</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((d) => (
                <tr key={d.idDemandeStage}>
                  <td>{d.prenomEtudiant} {d.nomEtudiant}</td>
                  <td>{d.nomCollege || '—'}</td>
                  <td>{d.periodeSouhaitee ?? '—'}</td>
                  <td>{d.competences ?? '—'}</td>
                  <td>{d.description}</td>
                  <td>
                    <span className={`badge ${STATUT_BADGE[d.statut] ?? 'badge-muted'}`}>
                      {STATUT_LABELS[d.statut] ?? d.statut}
                    </span>
                  </td>
                  <td>{formatDate(d.dateCreation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
