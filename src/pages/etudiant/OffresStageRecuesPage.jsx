import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  getMesOffresRecues,
  repondreOffreDirecte
} from '../../services/offreStageDirecteService';
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
  const [offreOuverte, setOffreOuverte] = useState(null);
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

    if (reponse === null) {
      return;
    }

    try {
      await repondreOffreDirecte(id, accepte, reponse || null);
      setMessage(accepte ? 'Offre acceptée.' : 'Offre refusée.');
      charger();
    } catch {
      setErreur("Impossible d'envoyer votre réponse.");
    }
  }

  function getTitreOffre(offre) {
    return offre.titreOffreStage || 'Offre de stage directe';
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Offres de stage reçues</h1>
        <p>
          Consultez les offres de stage directes qui vous sont proposées et
          répondez-y.
        </p>
      </div>

      {message && <p className="notice notice-success">{message}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}
      {chargement && <p>Chargement...</p>}

      {!chargement && offres.length === 0 && (
        <div className="empty-state">
          <h2>Aucune offre reçue</h2>
          <p>
            Aucun employeur ne vous a proposé de stage directement pour le
            moment.
          </p>
        </div>
      )}

      {!chargement && offres.length > 0 && (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Offre</th>
                <th>Conditions</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {offres.map((offre) => (
                <tr key={offre.idOffreDirecte}>
                  <td>
                    <button
                      type="button"
                      className="offre-table__titre-btn"
                      onClick={() => setOffreOuverte(offre)}
                    >
                      {getTitreOffre(offre)}
                    </button>
                  </td>

                  <td>{offre.conditions}</td>

                  <td>
                    {offre.dateDebutProposee
                      ? formatDate(offre.dateDebutProposee)
                      : '—'}
                  </td>

                  <td>
                    {offre.dateFinProposee
                      ? formatDate(offre.dateFinProposee)
                      : '—'}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        STATUT_BADGE[offre.statut] ?? 'badge-muted'
                      }`}
                    >
                      {STATUT_LABELS[offre.statut] ?? offre.statut}
                    </span>
                  </td>

                  <td>
                    {offre.statut === 'Envoyee' ? (
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-action"
                          onClick={() =>
                            handleRepondre(offre.idOffreDirecte, true)
                          }
                        >
                          Accepter
                        </button>

                        <button
                          type="button"
                          className="table-action danger-action"
                          onClick={() =>
                            handleRepondre(offre.idOffreDirecte, false)
                          }
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

      {offreOuverte && (
        <section className="panel" style={{ marginTop: '24px' }}>
          <div className="candidature-detail__header">
            <div>
              <p className="page-kicker">Détail de l&apos;offre</p>
              <h2 className="candidature-detail__nom">
                {getTitreOffre(offreOuverte)}
              </h2>
              <p className="candidature-detail__email">
                {offreOuverte.villeOffreStage || 'Lieu à confirmer'}
              </p>
            </div>

            <button
              type="button"
              className="secondary-action"
              onClick={() => setOffreOuverte(null)}
            >
              Fermer
            </button>
          </div>

          <dl className="offre-detail__dl">
            <dt>Description</dt>
            <dd>
              {offreOuverte.descriptionOffreStage ||
                'Aucune description liée à une offre publiée.'}
            </dd>

            <dt>Conditions proposées</dt>
            <dd>{offreOuverte.conditions}</dd>

            <dt>Adresse</dt>
            <dd>{offreOuverte.adresseOffreStage || 'Non précisée'}</dd>

            <dt>Session</dt>
            <dd>{offreOuverte.sessionStage || 'Non précisée'}</dd>

            <dt>Durée</dt>
            <dd>
              {offreOuverte.dureeHeuresParSemaine
                ? `${offreOuverte.dureeHeuresParSemaine} h / semaine`
                : 'Non précisée'}
            </dd>

            <dt>Rémunération</dt>
            <dd>
              {offreOuverte.remuneration != null
                ? `${offreOuverte.remuneration} $`
                : 'Non précisée'}
            </dd>

            <dt>Date proposée</dt>
            <dd>
              {offreOuverte.dateDebutProposee
                ? formatDate(offreOuverte.dateDebutProposee)
                : '—'}{' '}
              au{' '}
              {offreOuverte.dateFinProposee
                ? formatDate(offreOuverte.dateFinProposee)
                : '—'}
            </dd>

            <dt>Commentaire</dt>
            <dd>{offreOuverte.commentaire || 'Aucun commentaire.'}</dd>
          </dl>
        </section>
      )}
    </AppLayout>
  );
}