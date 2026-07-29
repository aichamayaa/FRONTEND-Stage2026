import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { getEtudiants } from '../../services/etudiantService';
import { getMesOffres } from '../../services/offreService';
import {
  creerOffreStageDirecte,
  getMesOffresDirectesEnvoyees
} from '../../services/offreStageDirecteService';
import { formatDate } from '../../utils/formatDate';
import { formatStatus } from '../../utils/formatStatus';

const STATUT_BADGE = {
  Envoyee: 'badge-muted',
  Acceptee: 'badge-success',
  Refusee: 'badge-danger',
  Annulee: 'badge-muted'
};

const initialForm = {
  conditions: '',
  dateDebutProposee: '',
  dateFinProposee: '',
  commentaire: ''
};

function getErreur(error, fallback) {
  return error.response?.data?.message ?? error.message ?? fallback;
}

function toDateTimeOrNull(value) {
  return value ? `${value}T12:00:00` : null;
}

export function OffresStageDirectesPage() {
  const [searchParams] = useSearchParams();
  const idEtudiantDepuisUrl = searchParams.get('idEtudiant');

  const [etudiants, setEtudiants] = useState([]);
  const [offres, setOffres] = useState([]);
  const [offresDirectes, setOffresDirectes] = useState([]);

  const [idEtudiantSelectionne, setIdEtudiantSelectionne] = useState('');
  const [idOffreSelectionnee, setIdOffreSelectionnee] = useState('');
  const [form, setForm] = useState(initialForm);

  const [chargement, setChargement] = useState(true);
  const [creationEnCours, setCreationEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [message, setMessage] = useState(null);

  const offresStage = useMemo(
    () => offres.filter((offre) => offre.typeOffre === 'Stage'),
    [offres]
  );

  const etudiantSelectionne = useMemo(
    () =>
      etudiants.find(
        (etudiant) =>
          etudiant.idEtudiant.toString() === idEtudiantSelectionne.toString()
      ),
    [etudiants, idEtudiantSelectionne]
  );

  useEffect(() => {
    chargerDonneesInitiales();
  }, []);

  useEffect(() => {
    if (!idEtudiantDepuisUrl || etudiants.length === 0) {
      return;
    }

    const etudiantExiste = etudiants.some(
      (etudiant) =>
        etudiant.idEtudiant.toString() === idEtudiantDepuisUrl.toString()
    );

    if (etudiantExiste) {
      setIdEtudiantSelectionne(idEtudiantDepuisUrl);
      setMessage('Étudiant recommandé sélectionné automatiquement.');
    }
  }, [idEtudiantDepuisUrl, etudiants]);

  async function chargerDonneesInitiales() {
    setChargement(true);
    setErreur(null);

    try {
      const [etudiantsData, offresData, offresDirectesData] =
        await Promise.all([
          getEtudiants(),
          getMesOffres(),
          getMesOffresDirectesEnvoyees()
        ]);

      setEtudiants(etudiantsData);
      setOffres(offresData);
      setOffresDirectes(offresDirectesData);
    } catch (error) {
      setErreur(getErreur(error, 'Impossible de charger les données.'));
    } finally {
      setChargement(false);
    }
  }

  async function chargerOffresDirectes() {
    const data = await getMesOffresDirectesEnvoyees();
    setOffresDirectes(data);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErreur(null);
    setMessage(null);

    if (!idEtudiantSelectionne) {
      setErreur('Veuillez sélectionner un étudiant.');
      return;
    }

    if (!form.conditions.trim()) {
      setErreur('Les conditions sont obligatoires.');
      return;
    }

    if (
      form.dateDebutProposee &&
      form.dateFinProposee &&
      form.dateFinProposee < form.dateDebutProposee
    ) {
      setErreur('La date de fin doit être après la date de début.');
      return;
    }

    const payload = {
      idEtudiant: Number(idEtudiantSelectionne),
      idOffreStage: idOffreSelectionnee ? Number(idOffreSelectionnee) : null,
      idCandidature: null,
      idDemandeStage: null,
      conditions: form.conditions.trim(),
      dateDebutProposee: toDateTimeOrNull(form.dateDebutProposee),
      dateFinProposee: toDateTimeOrNull(form.dateFinProposee),
      commentaire: form.commentaire.trim() || null
    };

    setCreationEnCours(true);

    try {
      await creerOffreStageDirecte(payload);

      setMessage('Offre de stage directe envoyée.');
      setForm(initialForm);
      setIdEtudiantSelectionne('');
      setIdOffreSelectionnee('');

      await chargerOffresDirectes();
    } catch (error) {
      setErreur(
        getErreur(error, "Impossible de créer l'offre de stage directe.")
      );
    } finally {
      setCreationEnCours(false);
    }
  }

  return (
    <AppLayout>
      <section className="page-header">
        <p className="page-kicker">Employeur</p>
        <h1>Offres de stage directes</h1>
        <p>
          Proposez directement un stage à un étudiant, avec ou sans candidature.
        </p>
      </section>

      {message && <p className="notice notice-success">{message}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <section className="admin-grid">
          <div className="panel">
            <h2>Nouvelle offre directe</h2>

            {idEtudiantDepuisUrl && (
              <p className="notice">
                Un étudiant a été transmis depuis une recommandation. Vous
                pouvez modifier la sélection au besoin.
              </p>
            )}

            <form className="admin-form" onSubmit={handleSubmit}>
              <label>
                Étudiant
                <select
                  value={idEtudiantSelectionne}
                  onChange={(event) =>
                    setIdEtudiantSelectionne(event.target.value)
                  }
                  required
                >
                  <option value="">Choisir un étudiant</option>
                  {etudiants.map((etudiant) => (
                    <option
                      key={etudiant.idEtudiant}
                      value={etudiant.idEtudiant}
                    >
                      {etudiant.prenom} {etudiant.nom}
                      {etudiant.courriel ? ` - ${etudiant.courriel}` : ''}
                    </option>
                  ))}
                </select>
              </label>

              {etudiantSelectionne && (
                <div className="notice">
                  Étudiant sélectionné :{' '}
                  <strong>
                    {etudiantSelectionne.prenom} {etudiantSelectionne.nom}
                  </strong>
                  {etudiantSelectionne.nomCollege
                    ? ` - ${etudiantSelectionne.nomCollege}`
                    : ''}
                </div>
              )}

              <label>
                Offre de stage liée (optionnel)
                <select
                  value={idOffreSelectionnee}
                  onChange={(event) =>
                    setIdOffreSelectionnee(event.target.value)
                  }
                >
                  <option value="">Aucune offre liée</option>
                  {offresStage.map((offre) => (
                    <option key={offre.idOffre} value={offre.idOffre}>
                      {offre.titre}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-grid">
                <label>
                  Date de début proposée
                  <input
                    type="date"
                    name="dateDebutProposee"
                    value={form.dateDebutProposee}
                    onChange={handleFormChange}
                    lang="fr-CA"
                  />
                </label>

                <label>
                  Date de fin proposée
                  <input
                    type="date"
                    name="dateFinProposee"
                    value={form.dateFinProposee}
                    onChange={handleFormChange}
                    lang="fr-CA"
                  />
                </label>
              </div>

              <label>
                Conditions
                <textarea
                  name="conditions"
                  value={form.conditions}
                  onChange={handleFormChange}
                  rows={4}
                  required
                  placeholder="Ex. Horaire, lieu, encadrement, modalités du stage..."
                />
              </label>

              <label>
                Commentaire
                <textarea
                  name="commentaire"
                  value={form.commentaire}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Commentaire optionnel pour l'étudiant."
                />
              </label>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-action"
                  disabled={creationEnCours || !idEtudiantSelectionne}
                >
                  {creationEnCours ? 'Envoi...' : "Envoyer l'offre directe"}
                </button>
              </div>
            </form>
          </div>

          <div className="panel admin-list-panel">
            <h2>Offres directes envoyées</h2>

            {offresDirectes.length === 0 ? (
              <div className="empty-state">
                <h2>Aucune offre directe</h2>
                <p>Les offres de stage directes envoyées apparaîtront ici.</p>
              </div>
            ) : (
              <div className="table-shell">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Étudiant</th>
                      <th>Conditions</th>
                      <th>Début</th>
                      <th>Fin</th>
                      <th>Statut</th>
                      <th>Réponse</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {offresDirectes.map((offreDirecte) => (
                      <tr key={offreDirecte.idOffreDirecte}>
                        <td>
                          {offreDirecte.prenomEtudiant}{' '}
                          {offreDirecte.nomEtudiant}
                        </td>

                        <td style={{ whiteSpace: 'pre-wrap' }}>
                          {offreDirecte.conditions}
                        </td>

                        <td>
                          {offreDirecte.dateDebutProposee
                            ? formatDate(offreDirecte.dateDebutProposee)
                            : '-'}
                        </td>

                        <td>
                          {offreDirecte.dateFinProposee
                            ? formatDate(offreDirecte.dateFinProposee)
                            : '-'}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              STATUT_BADGE[offreDirecte.statut] ??
                              'badge-muted'
                            }`}
                          >
                            {formatStatus(offreDirecte.statut)}
                          </span>
                        </td>

                        <td>{offreDirecte.reponseEtudiant ?? '-'}</td>

                        <td>{formatDate(offreDirecte.dateProposition)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </AppLayout>
  );
}