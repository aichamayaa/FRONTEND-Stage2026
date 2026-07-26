import { formatDate } from '../../utils/formatDate';
import { formatStatus } from '../../utils/formatStatus';

export function OffreTable({ offres, onVoir, onModifier, onSupprimer, isEmployeur }) {
  if (!offres || offres.length === 0) {
    return (
      <div className="empty-state">
        <h2>Aucune offre trouvée</h2>
        <p>Créez votre première offre avec le bouton ci-dessus.</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Type</th>
            <th>Ville</th>
            <th>Statut</th>
            <th>Publication</th>
            <th>Expiration</th>
            {isEmployeur && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {offres.map((offre) => (
            <tr key={offre.idOffre}>
              <td>
                <button
                  type="button"
                  className="offre-table__titre-btn"
                  onClick={() => onVoir(offre.idOffre)}
                >
                  {offre.titre}
                </button>
              </td>
              <td>
                <span className={`badge ${offre.typeOffre === 'Stage' ? 'badge-stage' : 'badge-emploi'}`}>
                  {offre.typeOffre}
                </span>
              </td>
              <td>{offre.ville}</td>
              <td>
                <span className={`badge ${offre.statut === 'Active' ? 'badge-success' : 'badge-muted'}`}>
                  {formatStatus(offre.statut)}
                </span>
              </td>
              <td>{formatDate(offre.datePublication)}</td>
              <td>{formatDate(offre.dateExpiration)}</td>
              {isEmployeur && (
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="table-action secondary-table-action"
                      onClick={() => onModifier(offre)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="table-action danger-action"
                      onClick={() => {
                        if (window.confirm('Supprimer cette offre ?')) {
                          onSupprimer(offre.idOffre);
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
