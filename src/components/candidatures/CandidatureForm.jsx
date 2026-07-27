import { useRef, useState } from 'react';
import {
  postuler,
  uploadDocument,
  validerPostulation
} from '../../services/candidatureService';

export function CandidatureForm({ idOffre, titreOffre, onSuccess }) {
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
      await validerPostulation(idOffre);

      const cvUrl = await uploadDocument(fichierCv);
      const lettreUrl = fichierLettre ? await uploadDocument(fichierLettre) : null;
      const candidature = await postuler({ idOffre, cvUrl, lettreUrl });
      setMessage(`Merci d'avoir postulé à : ${titreOffre ?? "l'offre"}. Numéro de confirmation : ${candidature.idCandidature}.`);
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
    } catch (error) {
      const messageApi =
        error?.response?.data?.message ??
        error?.message;

      setErreur(
        messageApi ||
        "Impossible d'envoyer la candidature."
      );
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
            <button
              type="button"
              className="primary-action"
              onClick={() => cvInputRef.current?.click()}
            >
              Ajouter un fichier
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
            <button
              type="button"
              className="primary-action"
              onClick={() => lettreInputRef.current?.click()}
            >
              Ajouter un fichier
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

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="primary-action" disabled={envoi}>
          {envoi ? 'Envoi...' : 'Soumettre ma candidature'}
        </button>
      </div>
    </form>
  );
}
