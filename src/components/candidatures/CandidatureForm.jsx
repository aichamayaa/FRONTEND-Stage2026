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

      const candidature = await postuler({
        idOffre,
        cvUrl,
        lettreUrl
      });

      setMessage(
        `Merci d'avoir postulé à : ${titreOffre ?? "l'offre"}. Numéro de confirmation : ${candidature.idCandidature}.`
      );

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
      const messageApi = error?.response?.data?.message ?? error?.message;

      setErreur(messageApi || "Impossible d'envoyer la candidature.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form className="candidature-form" onSubmit={handleSubmit}>
      <div className="candidature-form__header">
        <div>
          <p className="page-kicker">Documents requis</p>
          <h3>Joindre mes documents</h3>
          <p>
            Ajoutez votre CV et, au besoin, une lettre de motivation avant
            d’envoyer votre candidature.
          </p>
        </div>
      </div>

      <div className="candidature-form__documents">
        <div className="upload-card">
          <div>
            <span className="upload-card__label">CV</span>
            <strong>PDF ou Word</strong>
            <p>Document obligatoire pour postuler.</p>
          </div>

          <button
            type="button"
            className="secondary-action"
            onClick={() => cvInputRef.current?.click()}
          >
            Choisir un fichier
          </button>

          <span className={fichierCv ? 'upload-card__file' : 'upload-card__empty'}>
            {fichierCv ? fichierCv.name : 'Aucun fichier choisi'}
          </span>

          <input
            type="file"
            ref={cvInputRef}
            accept=".pdf,.doc,.docx"
            className="sr-only-file"
            onChange={(event) => setFichierCv(event.target.files[0] ?? null)}
          />
        </div>

        <div className="upload-card">
          <div>
            <span className="upload-card__label">Lettre de motivation</span>
            <strong>PDF ou Word</strong>
            <p>Optionnelle, mais recommandée.</p>
          </div>

          <button
            type="button"
            className="secondary-action"
            onClick={() => lettreInputRef.current?.click()}
          >
            Choisir un fichier
          </button>

          <span
            className={fichierLettre ? 'upload-card__file' : 'upload-card__empty'}
          >
            {fichierLettre ? fichierLettre.name : 'Aucun fichier choisi'}
          </span>

          <input
            type="file"
            ref={lettreInputRef}
            accept=".pdf,.doc,.docx"
            className="sr-only-file"
            onChange={(event) => setFichierLettre(event.target.files[0] ?? null)}
          />
        </div>
      </div>

      {erreur && <p className="notice notice-error">{erreur}</p>}
      {message && <p className="notice notice-success">{message}</p>}

      <div className="candidature-form__actions">
        <button type="submit" className="primary-action" disabled={envoi}>
          {envoi ? 'Envoi en cours...' : 'Soumettre ma candidature'}
        </button>
      </div>
    </form>
  );
}