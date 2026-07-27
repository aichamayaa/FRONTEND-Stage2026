export function OffreFilters({ filtreType, filtreStatut, onTypeChange, onStatutChange }) {
  return (
    <div className="offre-filters">
      <label className="offre-filters__label">
        Type
        <select
          className="offre-filters__select"
          value={filtreType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">Tous</option>
          <option value="Emploi">Emploi</option>
          <option value="Stage">Stage</option>
        </select>
      </label>

      <label className="offre-filters__label">
        Statut
        <select
          className="offre-filters__select"
          value={filtreStatut}
          onChange={(e) => onStatutChange(e.target.value)}
        >
          <option value="">Tous</option>
          <option value="Active">Active</option>
          <option value="Fermee">Fermée</option>
          <option value="Brouillon">Brouillon</option>
          <option value="Expiree">Expirée</option>
        </select>
      </label>
    </div>
  );
}
