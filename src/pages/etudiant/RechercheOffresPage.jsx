import { useState } from 'react';
import { OffreFilters } from '../../components/offres/OffreFilters';
import { OffreCard } from '../../components/offres/OffreCard';
import { rechercherOffres } from '../../services/offreService';

export function RechercheOffresPage() {
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [recherchee, setRecherchee] = useState(false);

  async function handleSearch(filtres) {
    setChargement(true);
    setErreur(null);

    try {
      const resultats = await rechercherOffres(filtres);
      setOffres(resultats);
    } catch {
      setErreur("Impossible de récupérer les offres.");
    } finally {
      setChargement(false);
      setRecherchee(true);
    }
  }

  return (
    <main className="recherche-offres">
      <h1>Recherche d'offres</h1>

      <OffreFilters onSearch={handleSearch} />

      {chargement && <p>Chargement...</p>}
      {erreur && <p className="erreur">{erreur}</p>}
      {!chargement && recherchee && offres.length === 0 && <p>Aucune offre trouvée.</p>}

      <section className="offres-liste">
        {offres.map((offre) => (
          <OffreCard key={offre.id} offre={offre} />
        ))}
      </section>
    </main>
  );
}
