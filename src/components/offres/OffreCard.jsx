export function OffreCard({ offre }) {
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
      </p>
      <p>{offre.description}</p>
      {offre.nombrePostes ? <p>Postes disponibles : {offre.nombrePostes}</p> : null}
    </article>
  );
}
