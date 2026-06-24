import { useState } from 'react';
import { postuler, uploadCv } from '../../services/candidatureService';

export function CandidatureForm({ offreId, onSuccess }) {
  const [cvFichier, setCvFichier] = useState(null);
  const [lettreMotivation, setLettreMotivation] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const formulaire = event.target;
    setErreur(null);
    setMessage(null);

    if (!cvFichier) {
      setErreur('Le CV est obligatoire.');
      return;
    }

    setEnvoi(true);

    try {
      const cvUrl = await uploadCv(cvFichier);
      const candidature = await postuler({
        idOffre: offreId,
        cvUrl,
        lettreMotivation: lettreMotivation || null
      });
      setMessage(`Candidature envoyée. Numéro de confirmation : ${candidature.idCandidature}.`);
      setCvFichier(null);
      setLettreMotivation('');
      formulaire.reset();
      if (onSuccess) {
        onSuccess(candidature);
      }
    } catch {
      setErreur("Impossible d'envoyer la candidature.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form className="candidature-form" onSubmit={handleSubmit}>
      <label>
        CV (fichier)
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(event) => setCvFichier(event.target.files[0] ?? null)}
        />
      </label>

      <label>
        Lettre de motivation
        <textarea
          rows={4}
          value={lettreMotivation}
          onChange={(event) => setLettreMotivation(event.target.value)}
        />
      </label>

      {erreur && <p className="form-error">{erreur}</p>}
      {message && <p className="form-success">{message}</p>}

      <button type="submit" disabled={envoi}>
        {envoi ? 'Envoi...' : 'Soumettre ma candidature'}
      </button>
    </form>
  );
}
