import { formatDate } from '../../utils/formatDate';
import { formatStatus } from '../../utils/formatStatus';

export function OffreCard({ offre, onVoir, onModifier, onSupprimer, isEmployeur }) {
  const badgeTypeClass = offre.typeOffre === 'Stage' ? 'badge-stage' : 'badge-emploi';
  const badgeStatutClass = offre.statut === 'Active' ? 'badge-success' : 'badge-muted';

  return (
    <div className="offre-card card">
      <div className="offre-card__header">
        <span className={`badge ${badgeTypeClass}`}>
          {offre.typeOffre === 'Stage' ? 'Stage' : 'Emploi'}
        </span>
        <span className={`badge ${badgeStatutClass}`}>{formatStatus(offre.statut)}</span>
      </div>

      <h3 className="offre-card__titre">{offre.titre}</h3>
      <p className="offre-card__employeur">{offre.nomEmployeur}</p>
      <p className="offre-card__ville">{offre.ville}</p>

      {offre.domaines?.length > 0 && (
        <div className="offre-card__domaines">
          {offre.domaines.map((d) => (
            <span key={d} className="badge badge-muted offre-card__domaine-tag">
              {d}
            </span>
          ))}
        </div>
      )}

      <p className="offre-card__date">
        Publié le {formatDate(offre.datePublication)}
        {offre.dateExpiration && (
          <> &middot; Expire le {formatDate(offre.dateExpiration)}</>
        )}
      </p>

      <div className="table-actions offre-card__actions">
        <button
          type="button"
          className="table-action"
          onClick={() => onVoir(offre.idOffre)}
        >
          Voir
        </button>

        {isEmployeur && onModifier && (
          <button
            type="button"
            className="table-action secondary-table-action"
            onClick={() => onModifier(offre)}
          >
            Modifier
          </button>
        )}

        {isEmployeur && onSupprimer && (
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
        )}
      </div>
    </div>
  );
}
