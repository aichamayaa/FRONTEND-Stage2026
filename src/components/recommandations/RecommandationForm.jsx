import { useState } from 'react';

export function RecommandationForm({
  employeurs,
  onEnvoyer,
  loading,
  error
}) {
  const [idEmployeurDestinataire, setIdEmployeurDestinataire] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [lettre, setLettre] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!idEmployeurDestinataire) {
      return;
    }

    if (!commentaire.trim() && !lettre) {
      return;
    }

    try {
      await onEnvoyer(idEmployeurDestinataire, commentaire.trim(), lettre);

      setIdEmployeurDestinataire('');
      setCommentaire('');
      setLettre(null);

      event.target.reset();
    } catch {
      return;
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Employeur destinataire
        <select
          value={idEmployeurDestinataire}
          onChange={(event) => setIdEmployeurDestinataire(event.target.value)}
          required
        >
          <option value="">Choisir un employeur</option>

          {employeurs.map((employeur) => (
            <option key={employeur.idEmployeur} value={employeur.idEmployeur}>
              {employeur.nomEntreprise || employeur.nom}
            </option>
          ))}
        </select>
      </label>

      <label>
        Commentaire
        <textarea
          rows="4"
          value={commentaire}
          onChange={(event) => setCommentaire(event.target.value)}
          placeholder="Recommandation pour cet étudiant"
        />
      </label>

      <label>
        Lettre de recommandation (optionnel)
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(event) => setLettre(event.target.files?.[0] ?? null)}
        />
      </label>

      {error && <p className="notice notice-error">{error}</p>}

      <button className="primary-action" type="submit" disabled={loading}>
        {loading ? 'Envoi en cours...' : 'Envoyer la recommandation'}
      </button>
    </form>
  );
}