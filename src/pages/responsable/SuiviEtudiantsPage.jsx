import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { suiviService } from '../../services/suiviService';

export function SuiviEtudiantsPage() {
  const [etudiants, setEtudiants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    typeDemarche: 'Note',
    note: '',
    visibleEtudiant: true
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function chargerEtudiants() {
    setLoading(true);
    const data = await suiviService.getEtudiantsSuivis();
    setEtudiants(data);
    setLoading(false);
  }

  async function ouvrirDetail(idEtudiant) {
    const data = await suiviService.getEtudiantDetail(idEtudiant);
    setSelected(data);
    setMessage('');
  }

  async function ajouterDemarche(event) {
    event.preventDefault();

    if (!selected || !form.note.trim()) {
      return;
    }

    await suiviService.ajouterDemarche(selected.idEtudiant, form);
    const detail = await suiviService.getEtudiantDetail(selected.idEtudiant);

    setSelected(detail);
    setForm({ typeDemarche: 'Note', note: '', visibleEtudiant: true });
    setMessage('Demarche ajoutee avec succes.');
  }

  useEffect(() => {
    chargerEtudiants();
  }, []);

  return (
    <AppLayout>
      <section className="page-header">
        <p className="page-kicker">Responsable de stage</p>
        <h1>Suivi des etudiants</h1>
        <p>
          Consultez la progression des etudiants et ajoutez des demarches de suivi.
        </p>
      </section>

      {message && <p className="notice notice-success">{message}</p>}

      <section className="admin-grid">
        <div className="panel admin-list-panel">
          <h2>Etudiants suivis</h2>

          {loading && <p>Chargement des etudiants...</p>}

          {!loading && etudiants.length === 0 && (
            <div className="empty-state">
              <h2>Aucun etudiant trouve</h2>
              <p>Aucun etudiant n'est rattache a votre college pour le moment.</p>
            </div>
          )}

          {!loading && etudiants.length > 0 && (
            <div className="table-shell">
              <table className="table">
                <thead>
                  <tr>
                    <th>Etudiant</th>
                    <th>Candidatures</th>
                    <th>Dernier statut</th>
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
                      <td>{etudiant.nombreCandidatures}</td>
                      <td>
                        <span className="badge badge-muted">
                          {etudiant.dernierStatutCandidature ?? 'Aucun'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => ouvrirDetail(etudiant.idEtudiant)}
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
              <h2>Detail etudiant</h2>
              <p>
                Selectionnez un etudiant pour voir ses candidatures et ses demarches.
              </p>
            </div>
          )}

          {selected && (
            <>
              <h2>
                {selected.prenom} {selected.nom}
              </h2>
              <p>{selected.courriel}</p>

              <h3>Candidatures</h3>
              {selected.candidatures.length === 0 ? (
                <p>Aucune candidature pour le moment.</p>
              ) : (
                <div className="table-shell">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Offre</th>
                        <th>Type</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.candidatures.map((candidature) => (
                        <tr key={candidature.idCandidature}>
                          <td>{candidature.titreOffre}</td>
                          <td>{candidature.typeOffre}</td>
                          <td>
                            <span className="badge badge-muted">
                              {candidature.statut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <h3>Demarches</h3>
              {selected.demarches.length === 0 ? (
                <p>Aucune demarche ajoutee.</p>
              ) : (
                <div className="documents-liste">
                  {selected.demarches.map((demarche) => (
                    <div className="document-item" key={demarche.idDemarche}>
                      <div>
                        <strong>{demarche.typeDemarche}</strong>
                        <p>{demarche.note}</p>
                        <span className="badge badge-muted">
                          {demarche.visibleEtudiant
                            ? 'Visible par etudiant'
                            : 'Note interne'}
                        </span>
                      </div>
                      <span>
                        {new Date(demarche.dateDemarche).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <form className="admin-form" onSubmit={ajouterDemarche}>
                <label>
                  Type de demarche
                  <select
                    value={form.typeDemarche}
                    onChange={(e) =>
                      setForm({ ...form, typeDemarche: e.target.value })
                    }
                  >
                    <option value="Note">Note</option>
                    <option value="Appel">Appel</option>
                    <option value="Courriel">Courriel</option>
                    <option value="Rencontre">Rencontre</option>
                  </select>
                </label>

                <label>
                  Visible par l'etudiant
                  <select
                    value={form.visibleEtudiant ? 'true' : 'false'}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        visibleEtudiant: e.target.value === 'true'
                      })
                    }
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non, note interne</option>
                  </select>
                </label>

                <label>
                  Note
                  <textarea
                    rows="4"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </label>

                <button className="primary-action" type="submit">
                  Ajouter la demarche
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </AppLayout>
  );
}