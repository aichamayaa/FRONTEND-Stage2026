import { useState } from 'react';

export function OffreFilters({ onSearch }) {
  const [type, setType] = useState('');
  const [lieu, setLieu] = useState('');
  const [motsCles, setMotsCles] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSearch({
      type: type || undefined,
      lieu: lieu || undefined,
      motsCles: motsCles || undefined
    });
  }

  return (
    <form className="offre-filters" onSubmit={handleSubmit}>
      <select value={type} onChange={(event) => setType(event.target.value)}>
        <option value="">Tous les types</option>
        <option value="EMPLOI">Emploi</option>
        <option value="STAGE">Stage</option>
      </select>

      <input
        type="text"
        placeholder="Lieu"
        value={lieu}
        onChange={(event) => setLieu(event.target.value)}
      />

      <input
        type="text"
        placeholder="Mots-clés"
        value={motsCles}
        onChange={(event) => setMotsCles(event.target.value)}
      />

      <button type="submit">Rechercher</button>
    </form>
  );
}
