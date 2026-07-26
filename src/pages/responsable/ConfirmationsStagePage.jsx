import { formatDate } from '../../utils/formatDate';
import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { stageService } from '../../services/stageService';
import { formatRole, formatStatus } from '../../utils/formatStatus';

export function ConfirmationsStagePage() {
  const { user } = useAuth();
  const [stages, setStages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const roleConfirmation =
    user?.role === 'Employeur' ? 'Employeur' : 'ResponsableStage';

  async function chargerStages() {
    setLoading(true);
    const data = await stageService.getStages();
    setStages(data);
    setLoading(false);
  }

  async function ouvrirStage(idStage) {
    const data = await stageService.getStageById(idStage);
    setSelected(data);
    setMotif('');
    setMessage('');
  }

  function confirmationDejaFaite(stage) {
    return stage.confirmations?.some(
      (confirmation) => confirmation.typeConfirmation === roleConfirmation
    );
  }

  async function confirmer(decision) {
    if (!selected) {
      return;
    }

    const updated = await stageService.confirmerStage(selected.idStage, {
      decision,
      motif
    });

    setSelected(updated);
    setMessage(`Confirmation ${decision.toLowerCase()} enregistrée.`);
    await chargerStages();
  }

  useEffect(() => {
    chargerStages();
  }, []);

  return (
    <AppLayout>
      <section className="page-header">
        <p className="page-kicker">Stages</p>
        <h1>Confirmations de stage</h1>
        <p>
          Confirmez séparément les stages afin d’officialiser le placement des
          étudiants.
        </p>
      </section>

      {message && <p className="notice notice-success">{message}</p>}

      <section className="admin-grid">
        <div className="panel admin-list-panel">
          <h2>Stages</h2>

          {loading && <p>Chargement des stages...</p>}

          {!loading && stages.length === 0 && (
            <div className="empty-state">
              <h2>Aucun stage</h2>
              <p>Aucun stage n’est disponible pour confirmation.</p>
            </div>
          )}

          {!loading && stages.length > 0 && (
            <div className="table-shell">
              <table className="table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Statut</th>
                    <th>Confirmations</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map((stage) => (
                    <tr key={stage.idStage}>
                      <td>{stage.nomEtudiant}</td>
                      <td>
                        <span className="badge badge-muted">{formatStatus(stage.statut)}</span>
                      </td>
                      <td>{stage.confirmations?.length ?? 0}/2</td>
                      <td>
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => ouvrirStage(stage.idStage)}
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel">
          {!selected && (
            <div className="empty-state">
              <h2>Détail du stage</h2>
              <p>Sélectionnez un stage pour voir ses confirmations.</p>
            </div>
          )}

          {selected && (
            <>
              <h2>{selected.nomEtudiant}</h2>
              <p>
                Statut : <strong>{formatStatus(selected.statut)}</strong>
              </p>

              <dl className="offre-detail__dl">
                <dt>Lieu</dt>
                <dd>{selected.lieu ?? 'Non précisé'}</dd>

                <dt>Superviseur</dt>
                <dd>{selected.superviseur ?? 'Non précisé'}</dd>

                <dt>Début</dt>
                <dd>
                  {selected.dateDebut
                    ? formatDate(selected.dateDebut)
                    : 'Non précisé'}
                </dd>

                <dt>Fin</dt>
                <dd>
                  {selected.dateFin
                    ? formatDate(selected.dateFin)
                    : 'Non précisé'}
                </dd>
              </dl>

              <h3>Confirmations</h3>

              {selected.confirmations.length === 0 ? (
                <p>Aucune confirmation enregistrée.</p>
              ) : (
                <div className="documents-liste">
                  {selected.confirmations.map((confirmation) => (
                    <div
                      className="document-item"
                      key={confirmation.idConfirmation}
                    >
                      <div>
                        <strong>{formatRole(confirmation.typeConfirmation)}</strong>
                        <p>{confirmation.motif ?? 'Aucun motif'}</p>
                      </div>
                      <span className="badge badge-muted">
                        {formatStatus(confirmation.decision)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {confirmationDejaFaite(selected) ? (
                <p className="notice notice-success">
                  Votre confirmation est déjà enregistrée.
                </p>
              ) : (
                <form className="admin-form">
                  <label>
                    Motif ou commentaire
                    <textarea
                      rows="4"
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                    />
                  </label>

                  <div className="form-actions">
                    <button
                      className="primary-action"
                      type="button"
                      onClick={() => confirmer('Accepte')}
                    >
                      Confirmer
                    </button>

                    <button
                      className="danger-action"
                      type="button"
                      onClick={() => confirmer('Refuse')}
                    >
                      Refuser
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </section>
    </AppLayout>
  );
}