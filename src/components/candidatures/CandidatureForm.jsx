import { useRef, useState } from 'react';
import { postuler, uploadCv } from '../../services/candidatureService';

export function CandidatureForm({ idOffre, onSuccess }) {
  const fileInputRef = useRef(null);
  const [fichier, setFichier] = useState(null);
  const [lettreMotivation, setLettreMotivation] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setErreur(null);
    setMessage(null);

    if (!fichier) {
      setErreur('Le CV est obligatoire.');
      return;
    }

    setEnvoi(true);

    try {
      const cvUrl = await uploadCv(fichier);
      const candidature = await postuler({
        idOffre,
        cvUrl,
        lettreMotivation: lettreMotivation || null
      });
      setMessage(`Candidature envoyée. Numéro de confirmation : ${candidature.idCandidature}.`);
      setFichier(null);
      setLettreMotivation('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    <form className="candidature-form card" onSubmit={handleSubmit}>
      <div>
        <label>CV (PDF ou Word)</label>
        <div>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Ajouter fichier
          </button>
          {fichier && <span style={{ marginLeft: 8 }}>{fichier.name}</span>}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={(event) => setFichier(event.target.files[0] ?? null)}
        />
      </div>

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
