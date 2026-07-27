import { formatDate } from '../../utils/formatDate';

const STATUTS = ['EnAttente', 'Vue', 'Acceptee', 'Refusee'];

const STATUT_LABELS = {
    EnAttente: 'En attente',
    Vue: 'Vue',
    Acceptee: 'Acceptée',
    Refusee: 'Refusée',
};

const STATUT_BADGE = {
    EnAttente: 'badge-muted',
    Vue: 'badge-vue',
    Acceptee: 'badge-success',
    Refusee: 'badge-danger',
};

export function CandidatureTable({
    candidatures,
    onVoirDetail,
    onChangerStatut,
    onConfirmerEmploi, // Ajout
    isOffreEmploi // Ajout
}) {
    if (!candidatures || candidatures.length === 0) {
        return (
            <div className="empty-state">
                <h2>Aucune candidature reçue</h2>
                <p>Les candidatures apparaîtront ici dès qu’un étudiant postulera.</p>
            </div>
        );
    }

    return (
        <div className="table-shell">
            <table className="table">
                <thead>
                    <tr>
                        <th>Candidat</th>
                        <th>Courriel</th>
                        <th>Date</th>
                        <th>CV</th>
                        <th>Lettre</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidatures.map((c) => (
                        <tr key={c.idCandidature}>
                            <td>
                                <button
                                    type="button"
                                    className="offre-table__titre-btn"
                                    onClick={() => onVoirDetail(c.idCandidature)}
                                >
                                    {c.prenomEtudiant} {c.nomEtudiant}
                                </button>
                            </td>
                            <td>{c.courrielEtudiant ?? c.emailEtudiant ?? '-'}</td> {/* Modification ici */}
                            <td>{formatDate(c.dateCandidature)}</td>
                            <td>{c.acv ? 'Oui' : 'Non'}</td>
                            <td>{c.aLettreMotivation ? 'Oui' : 'Non'}</td>
                            <td>
                                <span className={`badge ${STATUT_BADGE[c.statut] ?? 'badge-muted'}`}>
                                    {STATUT_LABELS[c.statut] ?? c.statut}
                                </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        type="button"
                                        className="table-action secondary-table-action"
                                        onClick={() => onVoirDetail(c.idCandidature)}
                                    >
                                        Détail
                                    </button>

                                    <select
                                        className="statut-select"
                                        value={c.statut}
                                        disabled={c.emploiConfirme}
                                        title={
                                            c.emploiConfirme
                                                ? "Le statut ne peut plus être modifié après la confirmation de l'emploi."
                                                : undefined
                                        }
                                        onChange={(e) =>
                                            onChangerStatut(c.idCandidature, e.target.value)
                                        }
                                    >
                                        {STATUTS.map((s) => (
                                            <option key={s} value={s}>{STATUT_LABELS[s]}</option>
                                        ))}
                                    </select>

                                    {isOffreEmploi &&
                                        c.statut === 'Acceptee' &&
                                        !c.emploiConfirme && (
                                            <button
                                                type="button"
                                                className="table-action"
                                                onClick={() =>
                                                    onConfirmerEmploi(c.idCandidature)
                                                }
                                            >
                                                Confirmer l&#39;emploi
                                            </button>
                                        )}

                                    {isOffreEmploi && c.emploiConfirme && (
                                        <span className="badge badge-success">
                                            Emploi confirmé
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

