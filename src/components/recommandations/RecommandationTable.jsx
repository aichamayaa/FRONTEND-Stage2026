import { formatDate } from '../../utils/formatDate';

export function RecommandationTable({ recommandations }) {
  if (!recommandations || recommandations.length === 0) {
    return <p>Aucune recommandation envoyée pour cet étudiant.</p>;
  }

  return (
    <div className="table-shell">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Commentaire</th>
            <th>Lettre</th>
          </tr>
        </thead>

        <tbody>
          {recommandations.map((r) => (
            <tr key={r.idRecommandation}>
              <td>{formatDate(r.dateCreation)}</td>
              <td>{r.commentaire || 'Aucun commentaire'}</td>
              <td>
                {r.aLettre ? (
                  <a
                    className="table-action"
                    href={`${import.meta.env.VITE_API_BASE_URL}/recommandations/${r.idRecommandation}/lettre`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir la lettre
                  </a>
                ) : (
                  'Aucune'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}