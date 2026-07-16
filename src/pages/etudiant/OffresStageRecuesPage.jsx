import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { getMesOffresRecues, repondreOffreDirecte } from '../../services/offreStageDirecteService';
import { formatDate } from '../../utils/formatDate';

const STATUT_LABELS = {
  Envoyee: 'En attente',
  Acceptee: 'Acceptée',
  Refusee: 'Refusée',
  Annulee: 'Annulée'
};

const STATUT_BADGE = {
  Envoyee: 'badge-muted',
  Acceptee: 'badge-success',
  Refusee: 'badge-danger',
  Annulee: 'badge-muted'
};

export function OffresStageRecuesPage() {
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [message, setMessage] = useState(null);

  async function charger() {
    setChargement(true);
    try {
      const data = await getMesOffresRecues();
      setOffres(data);
      setErreur(null);
    } catch {
      setErreur('Impossible de récupérer vos offres de stage.');
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  async function handleRepondre(id, accepte) {
    const reponse = window.prompt("Message pour l'employeur (optionnel) :", '');
    if (reponse === null) return;
    try {
      await repondreOffreDirecte(id, accepte, reponse || null);
      setMessage(accepte ? 'Offre acceptée.' : 'Offre refusée.');
      charger();
    } catch {
      setErreur("Impossible d'envoyer votre réponse.");
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Offres de stage reçues</h1>
        <p>Consultez les offres de stage directes qui vous sont proposées et répondez-y.</p>
      </div>

      {message && <p className="notice notice-success">{message}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}
      {chargement && <p>Chargement...</p>}

      {!chargement && offres.length === 0 && (
        <div className="empty-state">
          <h2>Aucune offre reçue</h2>
          <p>Aucun employeur ne vous a proposé de stage directement pour le moment.</p>
        </div>
      )}

      {!chargement && offres.length > 0 && (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Conditions</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offres.map((o) => (
                <tr key={o.idOffreDirecte}>
                  <td>{o.conditions}</td>
                  <td>{o.dateDebutProposee ? formatDate(o.dateDebutProposee) : '—'}</td>
                  <td>{o.dateFinProposee ? formatDate(o.dateFinProposee) : '—'}</td>
                  <td>
                    <span className={`badge ${STATUT_BADGE[o.statut] ?? 'badge-muted'}`}>
                      {STATUT_LABELS[o.statut] ?? o.statut}
                    </span>
                  </td>
                  <td>
                    {o.statut === 'Envoyee' ? (
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-action"
                          onClick={() => handleRepondre(o.idOffreDirecte, true)}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          className="table-action danger-action"
                          onClick={() => handleRepondre(o.idOffreDirecte, false)}
                        >
                          Refuser
                        </button>
                      </div>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
