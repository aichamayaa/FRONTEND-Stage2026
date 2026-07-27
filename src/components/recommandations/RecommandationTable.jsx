import { formatDate } from '../../utils/formatDate';

export function RecommandationTable({ recommandations }) {
  if (!recommandations || recommandations.length === 0) {
    return <p>Aucune recommandation envoyee pour cet etudiant.</p>;
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
              <td>{formatDate(r.dateRecommandation)}</td>
              <td>{r.commentaire || 'Aucun commentaire'}</td>
              <td>
                {r.urlLettre
                  ? (
                    <a
                      className="table-action"
                      href={r.urlLettre}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Voir la lettre
                    </a>
                  )
                  : 'Aucune'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
