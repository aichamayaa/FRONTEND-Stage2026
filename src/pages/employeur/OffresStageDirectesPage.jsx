import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { getCandidaturesOffre } from '../../services/candidatureService';
import { getMesOffres } from '../../services/offreService';
import {
    creerOffreStageDirecte,
    getMesOffresDirectesEnvoyees,
} from '../../services/offreStageDirecteService';
import { formatDate } from '../../utils/formatDate';
import { formatStatus } from '../../utils/formatStatus';

const STATUT_BADGE = {
    Envoyee: 'badge-muted',
    Acceptee: 'badge-success',
    Refusee: 'badge-danger',
    Annulee: 'badge-muted',
};

const initialForm = {
    conditions: '',
    dateDebutProposee: '',
    dateFinProposee: '',
    commentaire: '',
};

function getErreur(e, fallback) {
    return e.response?.data?.message ?? e.message ?? fallback;
}

function toDateTimeOrNull(value) {
    return value ? `${value}T12:00:00` : null;
}

export function OffresStageDirectesPage() {
    const [offres, setOffres] = useState([]);
    const [idOffreSelectionnee, setIdOffreSelectionnee] = useState('');
    const [candidatures, setCandidatures] = useState([]);
    const [candidatureSelectionnee, setCandidatureSelectionnee] = useState(null);
    const [offresDirectes, setOffresDirectes] = useState([]);
    const [form, setForm] = useState(initialForm);

    const [chargement, setChargement] = useState(true);
    const [chargementCandidatures, setChargementCandidatures] = useState(false);
    const [creationEnCours, setCreationEnCours] = useState(false);
    const [erreur, setErreur] = useState(null);
    const [message, setMessage] = useState(null);

    const offresStage = useMemo(
        () => offres.filter((o) => o.typeOffre === 'Stage'),
        [offres]
    );

    const offresDirectesActivesParCandidature = useMemo(() => {
        const resultats = new Map();

        offresDirectes
            .filter(
                (o) =>
                    o.idCandidature &&
                    ['Envoyee', 'Acceptee'].includes(o.statut)
            )
            .forEach((o) => {
                resultats.set(o.idCandidature, o);
            });

        return resultats;
    }, [offresDirectes]);

    useEffect(() => {
        chargerDonneesInitiales();
    }, []);

    useEffect(() => {
        if (!idOffreSelectionnee) {
            setCandidatures([]);
            setCandidatureSelectionnee(null);
            return;
        }

        chargerCandidatures(idOffreSelectionnee);
    }, [idOffreSelectionnee]);

    async function chargerDonneesInitiales() {
        setChargement(true);
        setErreur(null);

        try {
            const [offresData, offresDirectesData] = await Promise.all([
                getMesOffres(),
                getMesOffresDirectesEnvoyees(),
            ]);

            setOffres(offresData);
            setOffresDirectes(offresDirectesData);
        } catch (e) {
            setErreur(getErreur(e, 'Impossible de charger les données.'));
        } finally {
            setChargement(false);
        }
    }

    async function chargerOffresDirectes() {
        const data = await getMesOffresDirectesEnvoyees();
        setOffresDirectes(data);
    }

    async function chargerCandidatures(idOffre) {
        setChargementCandidatures(true);
        setErreur(null);
        setCandidatureSelectionnee(null);

        try {
            const data = await getCandidaturesOffre(idOffre);
            setCandidatures(data);
        } catch (e) {
            setErreur(getErreur(e, 'Impossible de charger les candidatures.'));
        } finally {
            setChargementCandidatures(false);
        }
    }

    function handleFormChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErreur(null);
        setMessage(null);

        if (!candidatureSelectionnee) {
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

        if (!candidatureSelectionnee.idEtudiant) {
            setErreur("Impossible de créer l’offre : IdEtudiant manquant.");
            return;
        }

        const payload = {
            idEtudiant: candidatureSelectionnee.idEtudiant,
            idOffreStage: Number(idOffreSelectionnee),
            idCandidature: candidatureSelectionnee.idCandidature,
            idDemandeStage: null,
            conditions: form.conditions.trim(),
            dateDebutProposee: toDateTimeOrNull(form.dateDebutProposee),
            dateFinProposee: toDateTimeOrNull(form.dateFinProposee),
            commentaire: form.commentaire.trim() || null,
        };

        setCreationEnCours(true);

        try {
            await creerOffreStageDirecte(payload);
            setMessage('Offre de stage directe envoyée.');
            setForm(initialForm);
            setCandidatureSelectionnee(null);
            await chargerOffresDirectes();

        } catch (e) {
            setErreur(getErreur(e, "Impossible de créer l’offre de stage directe."));
        } finally {
            setCreationEnCours(false);
        }
    }

    return (
        <AppLayout>
            <div className="page-header">
                <p className="page-kicker">Employeur</p>
                <h1>Offres de stage directes</h1>
                <p>
                    Proposez directement un stage à un étudiant ayant postulé à une offre de stage.
                </p>
            </div>

            {message && <p className="notice notice-success">{message}</p>}
            {erreur && <p className="notice notice-error">{erreur}</p>}

            {chargement ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <section className="admin-grid">
                        <div className="panel">
                            <h2>Nouvelle offre directe</h2>

                            <label className="offre-filters__label">
                                Offre de stage
                                <select
                                    className="offre-filters__select"
                                    value={idOffreSelectionnee}
                                    onChange={(e) => setIdOffreSelectionnee(e.target.value)}
                                >
                                    <option value="">-- Choisir une offre de stage --</option>
                                    {offresStage.map((o) => (
                                        <option key={o.idOffre} value={o.idOffre}>
                                            {o.titre}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {offresStage.length === 0 && (
                                <p className="notice">
                                    Aucune offre de stage active. Créez d’abord une offre de stage.
                                </p>
                            )}

                            {chargementCandidatures && <p>Chargement des candidatures...</p>}

                            {idOffreSelectionnee && !chargementCandidatures && candidatures.length === 0 && (
                                <p className="notice">Aucune candidature pour cette offre.</p>
                            )}

                            {candidatures.length > 0 && (
                                <div className="table-shell" style={{ marginTop: '16px' }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Étudiant</th>
                                                <th>Courriel</th>
                                                <th>Statut</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidatures.map((c) => {
                                                const offreDirecteExistante =
                                                    offresDirectesActivesParCandidature.get(c.idCandidature);

                                                const selectionBloquee = Boolean(offreDirecteExistante);

                                                return (
                                                    <tr key={c.idCandidature}>
                                                        <td>{c.prenomEtudiant} {c.nomEtudiant}</td>
                                                        <td>{c.courrielEtudiant ?? c.emailEtudiant ?? '-'}</td>
                                                        <td>
                                                            <span className="badge badge-muted">
                                                                {formatStatus(c.statut)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="table-action"
                                                                disabled={selectionBloquee}
                                                                title={
                                                                    selectionBloquee
                                                                        ? 'Une offre directe active existe déjà pour cette candidature.'
                                                                        : undefined
                                                                }
                                                                onClick={() => setCandidatureSelectionnee(c)}
                                                            >
                                                                {selectionBloquee
                                                                    ? `Offre ${formatStatus(offreDirecteExistante.statut)}`
                                                                    : candidatureSelectionnee?.idCandidature ===
                                                                        c.idCandidature
                                                                        ? 'Sélectionné'
                                                                        : 'Sélectionner'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <form className="admin-form" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                                <div className="form-grid">
                                    <label>
                                        Étudiant sélectionné
                                        <input
                                            value={
                                                candidatureSelectionnee
                                                    ? `${candidatureSelectionnee.prenomEtudiant} ${candidatureSelectionnee.nomEtudiant}`
                                                    : 'Aucun étudiant sélectionné'
                                            }
                                            disabled
                                        />
                                    </label>

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
                                        placeholder="Commentaire optionnel pour l’étudiant."
                                    />
                                </label>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="primary-action"
                                        disabled={creationEnCours || !candidatureSelectionnee}
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
                                                <th>Debut</th>
                                                <th>Fin</th>
                                                <th>Statut</th>
                                                <th>Réponse</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {offresDirectes.map((o) => (
                                                <tr key={o.idOffreDirecte}>
                                                    <td>{o.prenomEtudiant} {o.nomEtudiant}</td>
                                                    <td style={{ whiteSpace: 'pre-wrap' }}>{o.conditions}</td>
                                                    <td>{o.dateDebutProposee ? formatDate(o.dateDebutProposee) : '-'}</td>
                                                    <td>{o.dateFinProposee ? formatDate(o.dateFinProposee) : '-'}</td>
                                                    <td>
                                                        <span className={`badge ${STATUT_BADGE[o.statut] ?? 'badge-muted'}`}>
                                                            {formatStatus(o.statut)}
                                                        </span>
                                                    </td>
                                                    <td>{o.reponseEtudiant ?? '-'}</td>
                                                    <td>{formatDate(o.dateProposition)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </AppLayout>
    );
}
