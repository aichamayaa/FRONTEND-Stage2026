import { useState } from 'react';
import { getStatutOffre } from '../../services/offreService';

export function StatutOffrePage() {
  const [idOffre, setIdOffre] = useState('');
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setErreur(null);
    setResultat(null);

    try {
      const data = await getStatutOffre(idOffre);
      setResultat(data);
    } catch {
      setErreur('Offre introuvable ou erreur.');
    }
  }

  return (
    <main style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h1>Statut d'une offre</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="No de l'offre"
          value={idOffre}
          onChange={(event) => setIdOffre(event.target.value)}
        />
        <button type="submit">Vérifier</button>
      </form>

      {erreur && <p style={{ color: 'crimson' }}>{erreur}</p>}
      {resultat && (
        <p>
          Offre #{resultat.idOffre} → statut : <strong>{resultat.statut}</strong>
        </p>
      )}
    </main>
  );
}
