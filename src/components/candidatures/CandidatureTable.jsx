import { formatDate } from '../../utils/formatDate';
import { getUrlTelechargementDocument } from '../../services/candidatureService';

const STATUTS = ['EnAttente', 'Vue', 'Acceptee', 'Refusee'];

const STATUT_LABELS = {
  EnAttente: 'En attente',
  Vue: 'Vue',
  Acceptee: 'Acceptee',
  Refusee: 'Refusee',
};

const STATUT_BADGE = {
  EnAttente: 'badge-muted',
  Vue: 'badge-vue',
  Acceptee: 'badge-success',
  Refusee: 'badge-danger',
};

export function CandidatureTable({ candidatures, onVoirDetail, onChangerStatut }) {
  if (!candidatures || candidatures.length === 0) {
    return (
      <div className="empty-state">
        <h2>Aucune candidature recue</h2>
        <p>Les candidatures apparaitront ici des qu un etudiant postule.</p>
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
              <td>{c.emailEtudiant ?? '-'}</td>
              <td>{formatDate(c.dateCandidature)}</td>
              <td>{c.aCV ? 'Oui' : 'Non'}</td>
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
                    Detail
                  </button>
                  <select
                    className="statut-select"
                    value={c.statut}
                    onChange={(e) => onChangerStatut(c.idCandidature, e.target.value)}
                  >
                    {STATUTS.map((s) => (
                      <option key={s} value={s}>{STATUT_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
