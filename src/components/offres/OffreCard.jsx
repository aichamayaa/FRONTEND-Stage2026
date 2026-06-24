import { useState } from 'react';
import { CandidatureForm } from '../candidatures/CandidatureForm';

export function OffreCard({ offre }) {
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  if (!offre) {
    return null;
  }

  return (
    <article className="offre-card">
      <h3>{offre.titre}</h3>
      <p className="offre-card__meta">
        {offre.typeOffre}
        {offre.lieu ? ` · ${offre.lieu}` : ''}
        {offre.remunere ? ' · Rémunéré' : ''}
        {offre.statut ? ` · ${offre.statut}` : ''}
      </p>
      <p>{offre.description}</p>
      {offre.nombrePostes ? <p>Postes disponibles : {offre.nombrePostes}</p> : null}

      <button type="button" onClick={() => setAfficherFormulaire((valeur) => !valeur)}>
        {afficherFormulaire ? 'Annuler' : 'Postuler'}
      </button>

      {afficherFormulaire && (
        <CandidatureForm
          offreId={offre.id}
          onSuccess={() => setAfficherFormulaire(false)}
        />
      )}
    </article>
  );
}
