import { useEffect, useState, Fragment } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  getMesCandidatures,
  mettreAJourCandidature,
  retirerCandidature
} from '../../services/candidatureService';
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

export function MesCandidaturesPage() {
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [message, setMessage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  async function charger() {
    setChargement(true);
    try {
      const data = await getMesCandidatures();
      setCandidatures(data);
      setErreur(null);
    } catch {
      setErreur('Impossible de récupérer vos candidatures.');
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  async function handleRetirer(id) {
    if (!window.confirm('Retirer cette candidature ?')) return;
    try {
      await retirerCandidature(id);
      setMessage('Candidature retirée.');
      charger();
    } catch {
      setErreur('Impossible de retirer la candidature.');
    }
  }

  function ouvrirEdition(c) {
    setEditId(c.idCandidature);
    setEditMessage('');
    setMessage(null);
  }

  async function handleEnregistrer(id) {
    try {
      await mettreAJourCandidature(id, editMessage);
      setMessage('Candidature mise à jour.');
      setEditId(null);
      charger();
    } catch {
      setErreur('Impossible de mettre à jour la candidature.');
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Mes candidatures</h1>
        <p>Suivez vos candidatures, modifiez votre message ou retirez une candidature.</p>
      </div>

      {message && <p className="notice notice-success">{message}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}
      {chargement && <p>Chargement...</p>}

      {!chargement && candidatures.length === 0 && (
        <div className="empty-state">
          <h2>Aucune candidature</h2>
          <p>Vous n&#39;avez postulé à aucune offre pour le moment.</p>
        </div>
      )}

      {!chargement && candidatures.length > 0 && (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Offre</th>
                <th>Statut</th>
                <th>CV</th>
                <th>Lettre</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {candidatures.map((c) => (
                <Fragment key={c.idCandidature}>
                  <tr>
                    <td>{c.titreOffre}</td>
                    <td>
                      <span className={`badge ${STATUT_BADGE[c.statut] ?? 'badge-muted'}`}>
                        {STATUT_LABELS[c.statut] ?? c.statut}
                      </span>
                    </td>
                    <td>{c.acv ? 'Oui' : 'Non'}</td>
                    <td>{c.aLettreMotivation ? 'Oui' : 'Non'}</td>
                    <td>{formatDate(c.dateCandidature)}</td>
                    <td>
                      {c.statut === 'EnAttente' ? (
                        <div className="table-actions">
                          <button
                            type="button"
                            className="table-action"
                            onClick={() => ouvrirEdition(c)}
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            className="table-action danger-action"
                            onClick={() => handleRetirer(c.idCandidature)}
                          >
                            Retirer
                          </button>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  </tr>

                  {['Acceptee', 'Refusee'].includes(c.statut) && (
                    <tr>
                      <td colSpan={6}>
                        <div className="candidature-reponse">
                          <strong className="candidature-reponse__titre">
                            Réponse de l’employeur
                          </strong>

                          <p className="candidature-reponse__message">
                            {c.messageReponseEmployeur || 'Aucun message fourni.'}
                          </p>

                          {c.dateReponseEmployeur && (
                            <small className="candidature-reponse__date">
                              Réponse reçue le {formatDate(c.dateReponseEmployeur)}
                            </small>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {c.emploiConfirme && (
                      <tr>
                          <td colSpan={6}>
                              <div className="candidature-reponse">
                                  <strong className="candidature-reponse__titre">
                                      Emploi confirmé
                                  </strong>

                                  <p className="candidature-reponse__message">
                                      {c.messageConfirmationEmploi ||
                                          "Emploi confirmé par l'employeur."}
                                  </p>

                                  {c.dateConfirmationEmploi && (
                                      <small className="candidature-reponse__date">
                                          Confirmation reçue le{' '}
                                          {formatDate(c.dateConfirmationEmploi)}
                                      </small>
                                  )}
                              </div>
                          </td>
                      </tr>
                  )}
                  {editId === c.idCandidature && (
                    <tr>
                      <td colSpan={6}>
                        <label>
                          Nouveau message de motivation
                          <textarea
                            rows={3}
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            style={{ width: '100%' }}
                          />
                        </label>

                        <div className="table-actions" style={{ marginTop: 8 }}>
                          <button
                            type="button"
                            className="primary-action"
                            onClick={() => handleEnregistrer(c.idCandidature)}
                          >
                            Enregistrer
                          </button>

                          <button
                            type="button"
                            className="secondary-action"
                            onClick={() => setEditId(null)}
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
