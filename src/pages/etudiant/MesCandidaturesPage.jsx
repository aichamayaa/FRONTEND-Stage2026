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

function getConfirmationContent(candidature) {
  if (candidature.emploiConfirme) {
    return {
      badge: 'Emploi confirmé',
      badgeClass: 'badge-success',
      titre: 'Emploi confirmé',
      message:
        candidature.messageConfirmationEmploi ||
        "Emploi confirmé par l'employeur.",
      date: candidature.dateConfirmationEmploi
    };
  }

  if (candidature.stageConfirme) {
    return {
      badge: 'Stage confirmé',
      badgeClass: 'badge-success',
      titre: 'Stage confirmé',
      message:
        'Votre stage a été confirmé par l’employeur et le responsable de stage.',
      date: candidature.dateConfirmationStage
    };
  }

  if (candidature.nombreConfirmationsStage > 0) {
    return {
      badge: `${candidature.nombreConfirmationsStage}/2`,
      badgeClass: 'badge-muted',
      titre: 'Stage en confirmation',
      message:
        `Votre stage a reçu ${candidature.nombreConfirmationsStage} confirmation` +
        `${candidature.nombreConfirmationsStage > 1 ? 's' : ''} sur 2.`,
      date: candidature.dateConfirmationStage
    };
  }

  return null;
}

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

  function ouvrirEdition(candidature) {
    setEditId(candidature.idCandidature);
    setEditMessage(candidature.messageMotivation ?? '');
    setMessage(null);
    setErreur(null);
  }

  async function handleEnregistrer(id) {
    try {
      await mettreAJourCandidature(id, editMessage);
      setMessage('Candidature mise à jour.');
      setErreur(null);
      setEditId(null);
      await charger();
    } catch {
      setErreur('Impossible de mettre à jour la candidature.');
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Mes candidatures</h1>
        <p>
          Suivez vos candidatures, modifiez votre message ou retirez une
          candidature.
        </p>
      </div>

      {message && <p className="notice notice-success">{message}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}
      {chargement && <p>Chargement...</p>}

      {!chargement && candidatures.length === 0 && (
        <div className="empty-state">
          <h2>Aucune candidature</h2>
          <p>Vous n&apos;avez postulé à aucune offre pour le moment.</p>
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
                <th>Confirmé</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {candidatures.map((candidature) => {
                const confirmation = getConfirmationContent(candidature);

                return (
                  <Fragment key={candidature.idCandidature}>
                    <tr>
                      <td>{candidature.titreOffre}</td>

                      <td>
                        <span
                          className={`badge ${
                            STATUT_BADGE[candidature.statut] ?? 'badge-muted'
                          }`}
                        >
                          {STATUT_LABELS[candidature.statut] ?? candidature.statut}
                        </span>
                      </td>

                      <td>{candidature.acv ? 'Oui' : 'Non'}</td>
                      <td>{candidature.aLettreMotivation ? 'Oui' : 'Non'}</td>
                      <td>{formatDate(candidature.dateCandidature)}</td>

                      <td>
                        {confirmation ? (
                          <span className={`badge ${confirmation.badgeClass}`}>
                            {confirmation.badge}
                          </span>
                        ) : (
                          <span>—</span>
                        )}
                      </td>

                      <td>
                        {candidature.statut === 'EnAttente' ? (
                          <div className="table-actions">
                            <button
                              type="button"
                              className="table-action"
                              onClick={() => ouvrirEdition(candidature)}
                            >
                              Modifier
                            </button>

                            <button
                              type="button"
                              className="table-action danger-action"
                              onClick={() =>
                                handleRetirer(candidature.idCandidature)
                              }
                            >
                              Retirer
                            </button>
                          </div>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                    </tr>

                    {['Acceptee', 'Refusee'].includes(candidature.statut) && (
                      <tr>
                        <td colSpan={7}>
                          <div className="candidature-reponse">
                            <strong className="candidature-reponse__titre">
                              Réponse de l’employeur
                            </strong>

                            <p className="candidature-reponse__message">
                              {candidature.messageReponseEmployeur ||
                                'Aucun message fourni.'}
                            </p>

                            {candidature.dateReponseEmployeur && (
                              <small className="candidature-reponse__date">
                                Réponse reçue le{' '}
                                {formatDate(candidature.dateReponseEmployeur)}
                              </small>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {confirmation && (
                      <tr>
                        <td colSpan={7}>
                          <div className="candidature-reponse">
                            <strong className="candidature-reponse__titre">
                              {confirmation.titre}
                            </strong>

                            <p className="candidature-reponse__message">
                              {confirmation.message}
                            </p>

                            {confirmation.date && (
                              <small className="candidature-reponse__date">
                                Confirmation reçue le{' '}
                                {formatDate(confirmation.date)}
                              </small>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {editId === candidature.idCandidature && (
                      <tr>
                        <td colSpan={7}>
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
                              onClick={() =>
                                handleEnregistrer(candidature.idCandidature)
                              }
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}