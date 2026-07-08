import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { getDomainesEtudes } from '../../services/domaineEtudeService';
import { creerDemandeStage, getMesDemandesStage } from '../../services/demandeStageService';
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

export function DemandeStagePage() {
  const [domaines, setDomaines] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [idDomaine, setIdDomaine] = useState('');
  const [periodeSouhaitee, setPeriodeSouhaitee] = useState('');
  const [competences, setCompetences] = useState('');
  const [description, setDescription] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  async function charger() {
    try {
      const data = await getMesDemandesStage();
      setDemandes(data);
    } catch {
      setErreur('Impossible de charger vos demandes.');
    }
  }

  useEffect(() => {
    getDomainesEtudes()
      .then(setDomaines)
      .catch(() => setErreur('Impossible de charger les domaines.'));
    charger();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    setMessage(null);
    if (!idDomaine || !description.trim()) {
      setErreur("Le domaine et la description sont obligatoires.");
      return;
    }
    setEnvoi(true);
    try {
      await creerDemandeStage({
        idDomaine: Number(idDomaine),
        description,
        periodeSouhaitee: periodeSouhaitee || null,
        competences: competences || null
      });
      setMessage('Demande de stage envoyée.');
      setIdDomaine('');
      setPeriodeSouhaitee('');
      setCompetences('');
      setDescription('');
      charger();
    } catch {
      setErreur("Impossible d'envoyer la demande de stage.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Demande de stage</h1>
        <p>Formulez une demande de stage dans un domaine d'études.</p>
      </div>

      <form className="panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Domaine d'études *
            <select value={idDomaine} onChange={(e) => setIdDomaine(e.target.value)}>
              <option value="">-- Choisir --</option>
              {domaines.map((d) => (
                <option key={d.idDomaine} value={d.idDomaine}>{d.nom}</option>
              ))}
            </select>
          </label>
          <label>
            Période souhaitée
            <input
              type="text"
              value={periodeSouhaitee}
              onChange={(e) => setPeriodeSouhaitee(e.target.value)}
              placeholder="Ex : Hiver 2026"
            />
          </label>
          <label>
            Compétences
            <textarea rows={2} value={competences} onChange={(e) => setCompetences(e.target.value)} />
          </label>
          <label>
            Description du projet *
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
        </div>

        {erreur && <p className="notice notice-error">{erreur}</p>}
        {message && <p className="notice notice-success">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="primary-action" disabled={envoi}>
            {envoi ? 'Envoi...' : 'Envoyer la demande'}
          </button>
        </div>
      </form>

      <div className="page-header" style={{ marginTop: 24 }}>
        <h2>Mes demandes de stage</h2>
      </div>

      {demandes.length === 0 ? (
        <p className="notice">Aucune demande pour le moment.</p>
      ) : (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Domaine</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((d) => (
                <tr key={d.idDemandeStage}>
                  <td>{d.nomDomaine}</td>
                  <td>{d.periodeSouhaitee ?? '—'}</td>
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
