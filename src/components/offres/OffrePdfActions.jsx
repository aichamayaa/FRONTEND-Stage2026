import { useState } from 'react';
import { getPdfOffreBlob } from '../../services/pdfService';

export function OffrePdfActions({ idOffre }) {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  async function handleAfficher() {
    setErreur(null);
    setChargement(true);

    try {
      const blob = await getPdfOffreBlob(idOffre);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
    } finally {
      setChargement(false);
    }
  }

  async function handleImprimer() {
    setErreur(null);
    setChargement(true);

    try {
      const blob = await getPdfOffreBlob(idOffre);
      const url = URL.createObjectURL(blob);

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = url;

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };

      document.body.appendChild(iframe);
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <div>
      <div className="table-actions">
        <button
          type="button"
          className="secondary-action"
          onClick={handleAfficher}
          disabled={chargement}
        >
          Afficher en PDF
        </button>

        <button
          type="button"
          className="secondary-action"
          onClick={handleImprimer}
          disabled={chargement}
        >
          Imprimer
        </button>
      </div>

      {erreur && <p className="notice notice-error">{erreur}</p>}
    </div>
  );
}
