import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { RecommandationForm } from '../../components/recommandations/RecommandationForm';
import { RecommandationTable } from '../../components/recommandations/RecommandationTable';
import { suiviService } from '../../services/suiviService';
import {
  envoyerRecommandation,
  getRecommandationsEtudiant,
} from '../../services/recommandationService';

function messageErreur(e) {
  const data = e.response?.data;

  if (data?.errors) {
    return Object.values(data.errors).flat().join(' ');
  }

  return data?.message ?? data?.title ?? e.message;
}

export function RecommandationsPage() {
  const [etudiants, setEtudiants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recommandations, setRecommandations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingRecommandations, setLoadingRecommandations] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const [erreur, setErreur] = useState('');
  const [erreurForm, setErreurForm] = useState('');
  const [succes, setSucces] = useState('');

  async function chargerEtudiants() {
    setLoading(true);
    setErreur('');

    try {
      const data = await suiviService.getEtudiantsSuivis();
      setEtudiants(data);
    } catch (e) {
      setErreur(messageErreur(e));
      setEtudiants([]);
    } finally {
      setLoading(false);
    }
  }

  async function ouvrirEtudiant(etudiant) {
    setSelected(etudiant);
    setRecommandations([]);
    setErreur('');
    setErreurForm('');
    setSucces('');
    setLoadingRecommandations(true);

    try {
      const data = await getRecommandationsEtudiant(etudiant.idEtudiant);
      setRecommandations(data);
    } catch (e) {
      setErreur(messageErreur(e));
      setRecommandations([]);
    } finally {
      setLoadingRecommandations(false);
    }
  }

  async function handleEnvoyer(commentaire, lettre) {
    if (!selected) {
      return;
    }

    setLoadingForm(true);
    setErreurForm('');
    setSucces('');

    try {
      await envoyerRecommandation(selected.idEtudiant, commentaire, lettre);

      const data = await getRecommandationsEtudiant(selected.idEtudiant);
      setRecommandations(data);

      setSucces('Recommandation envoyée avec succès.');
    } catch (e) {
      setErreurForm(messageErreur(e));
    } finally {
      setLoadingForm(false);
    }
  }

  useEffect(() => {
    chargerEtudiants();
  }, []);

  return (
    <AppLayout>
      <section className="page-header">
        <p className="page-kicker">Responsable de stage</p>
        <h1>Recommandations</h1>
        <p>
          Recommandez un étudiant à l&apos;aide d&apos;un commentaire ou
          d&apos;une lettre.
        </p>
      </section>

      {succes && <p className="notice notice-success">{succes}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}

      <section className="admin-grid">
        <div className="panel admin-list-panel">
          <h2>Étudiants suivis</h2>

          {loading && <p>Chargement des étudiants...</p>}

          {!loading && etudiants.length === 0 && (
            <div className="empty-state">
              <h2>Aucun étudiant trouvé</h2>
              <p>
                Aucun étudiant n&apos;est rattaché à votre collège pour le moment.
              </p>
            </div>
          )}

          {!loading && etudiants.length > 0 && (
            <div className="table-shell">
              <table className="table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {etudiants.map((etudiant) => (
                    <tr key={etudiant.idEtudiant}>
                      <td>
                        <strong>
                          {etudiant.prenom} {etudiant.nom}
                        </strong>
                        <br />
                        <span>{etudiant.courriel}</span>
                      </td>

                      <td>
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => ouvrirEtudiant(etudiant)}
                        >
                          Recommander
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
              <h2>Recommandation</h2>
              <p>
                Sélectionnez un étudiant pour lui envoyer une recommandation.
              </p>
            </div>
          )}

          {selected && (
            <>
              <h2>
                {selected.prenom} {selected.nom}
              </h2>

              <p>{selected.courriel}</p>

              <h3>Recommandations envoyées</h3>

              {loadingRecommandations ? (
                <p>Chargement des recommandations...</p>
              ) : (
                <RecommandationTable recommandations={recommandations} />
              )}

              <div style={{ marginTop: '24px' }}>
                <RecommandationForm
                  onEnvoyer={handleEnvoyer}
                  loading={loadingForm}
                  error={erreurForm}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </AppLayout>
  );
}