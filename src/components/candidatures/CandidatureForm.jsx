import { useRef, useState } from 'react';
import { postuler, uploadDocument } from '../../services/candidatureService';

export function CandidatureForm({ idOffre, onSuccess }) {
  const cvInputRef = useRef(null);
  const lettreInputRef = useRef(null);
  const [fichierCv, setFichierCv] = useState(null);
  const [fichierLettre, setFichierLettre] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState(null);
  const [erreur, setErreur] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setErreur(null);
    setMessage(null);

    if (!fichierCv) {
      setErreur('Le CV est obligatoire.');
      return;
    }

    setEnvoi(true);

    try {
      const cvUrl = await uploadDocument(fichierCv);
      const lettreUrl = fichierLettre ? await uploadDocument(fichierLettre) : null;
      const candidature = await postuler({ idOffre, cvUrl, lettreUrl });
      setMessage(`Candidature envoyée. Numéro de confirmation : ${candidature.idCandidature}.`);
      setFichierCv(null);
      setFichierLettre(null);
      if (cvInputRef.current) {
        cvInputRef.current.value = '';
      }
      if (lettreInputRef.current) {
        lettreInputRef.current.value = '';
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
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <label>CV (PDF ou Word)</label>
          <div>
            <button type="button" onClick={() => cvInputRef.current?.click()}>
              Ajouter fichier
            </button>
            {fichierCv && <span style={{ marginLeft: 8 }}>{fichierCv.name}</span>}
          </div>
          <input
            type="file"
            ref={cvInputRef}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(event) => setFichierCv(event.target.files[0] ?? null)}
          />
        </div>

        <div>
          <label>Lettre de motivation (PDF ou Word)</label>
          <div>
            <button type="button" onClick={() => lettreInputRef.current?.click()}>
              Ajouter fichier
            </button>
            {fichierLettre && <span style={{ marginLeft: 8 }}>{fichierLettre.name}</span>}
          </div>
          <input
            type="file"
            ref={lettreInputRef}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(event) => setFichierLettre(event.target.files[0] ?? null)}
          />
        </div>
      </div>

      {erreur && <p className="form-error">{erreur}</p>}
      {message && <p className="form-success">{message}</p>}

      <button type="submit" disabled={envoi}>
        {envoi ? 'Envoi...' : 'Soumettre ma candidature'}
      </button>
    </form>
  );
}
