import { useState } from 'react';
import { rechercherOffres } from '../../services/offreService';
import { OffreCard } from '../../components/offres/OffreCard';
import { CandidatureForm } from '../../components/candidatures/CandidatureForm';

export function RechercheOffresPage() {
  const [type, setType] = useState('');
  const [lieu, setLieu] = useState('');
  const [motsCles, setMotsCles] = useState('');
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [recherchee, setRecherchee] = useState(false);
  const [idOffrePostuler, setIdOffrePostuler] = useState(null);

  async function handleSearch(event) {
    event.preventDefault();
    setChargement(true);
    setErreur(null);
    setIdOffrePostuler(null);

    try {
      const data = await rechercherOffres({
        type: type || undefined,
        lieu: lieu || undefined,
        motsCles: motsCles || undefined
      });
      setOffres(data);
    } catch {
      setErreur('Impossible de récupérer les offres.');
    } finally {
      setChargement(false);
      setRecherchee(true);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Recherche d'offres</h1>

      <form onSubmit={handleSearch} className="offre-filters">
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Tous les types</option>
          <option value="Emploi">Emploi</option>
          <option value="Stage">Stage</option>
        </select>
        <input
          placeholder="Lieu"
          value={lieu}
          onChange={(event) => setLieu(event.target.value)}
        />
        <input
          placeholder="Mots-clés"
          value={motsCles}
          onChange={(event) => setMotsCles(event.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {chargement && <p>Chargement...</p>}
      {erreur && <p className="form-error">{erreur}</p>}
      {!chargement && recherchee && offres.length === 0 && <p>Aucune offre trouvée.</p>}

      <div className="offres-liste">
        {offres.map((offre) => (
          <OffreCard
            key={offre.idOffre}
            offre={offre}
            isEmployeur={false}
            onVoir={(id) => setIdOffrePostuler(id)}
          />
        ))}
      </div>

      {idOffrePostuler && (
        <section style={{ marginTop: 24 }}>
          <h2>Postuler à l'offre #{idOffrePostuler}</h2>
          <CandidatureForm
            idOffre={idOffrePostuler}
            onSuccess={() => setIdOffrePostuler(null)}
          />
        </section>
      )}
    </main>
  );
}
