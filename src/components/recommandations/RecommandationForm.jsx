import { useState } from 'react';

export function RecommandationForm({ onEnvoyer, loading, error }) {
  const [commentaire, setCommentaire] = useState('');
  const [lettre, setLettre] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!commentaire.trim() && !lettre) {
      return;
    }

    try {
      await onEnvoyer(commentaire.trim(), lettre);
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
        Commentaire
        <textarea
          rows="4"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Recommandation pour cet etudiant"
        />
      </label>

      <label>
        Lettre de recommandation (optionnel)
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setLettre(e.target.files?.[0] ?? null)}
        />
      </label>

      {error && <p className="notice notice-error">{error}</p>}

      <button className="primary-action" type="submit" disabled={loading}>
        {loading ? 'Envoi en cours...' : 'Envoyer la recommandation'}
      </button>
    </form>
  );
}
