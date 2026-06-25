import { formatDate } from '../../utils/formatDate';
import { getUrlTelechargementDocument } from '../../services/candidatureService';

const STATUT_LABELS = {
  EnAttente: 'En attente',
  Vue: 'Vue',
  Acceptee: 'Acceptee',
  Refusee: 'Refusee',
};

const TYPE_LABELS = {
  CV: 'CV',
  LettreMotivation: 'Lettre de motivation',
  Autre: 'Autre',
};

export function CandidatureDetail({ candidature, onRetour }) {
  if (!candidature) return null;

  const token = localStorage.getItem('token');

  return (
    <div className="candidature-detail">
      <button
        type="button"
        className="secondary-action"
        style={{ marginBottom: '20px' }}
        onClick={onRetour}
      >
        Retour aux candidatures
      </button>

      <div className="panel">
        <div className="candidature-detail__header">
          <div>
            <h2 className="candidature-detail__nom">
              {candidature.prenomEtudiant} {candidature.nomEtudiant}
            </h2>
            {candidature.emailEtudiant && (
              <p className="candidature-detail__email">{candidature.emailEtudiant}</p>
            )}
          </div>
          <span className={`badge ${candidature.statut === 'Acceptee' ? 'badge-success' : 'badge-muted'}`}>
            {STATUT_LABELS[candidature.statut] ?? candidature.statut}
          </span>
        </div>

        <p className="candidature-detail__date">
          Candidature soumise le {formatDate(candidature.dateCandidature)}
        </p>

        {candidature.messageMotivation && (
          <div className="candidature-detail__message">
            <h3>Message de motivation</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{candidature.messageMotivation}</p>
          </div>
        )}

        {candidature.documents?.length > 0 && (
          <div className="candidature-detail__documents">
            <h3>Documents (US-12)</h3>
            <div className="documents-liste">
              {candidature.documents.map((doc) => (
                <div key={doc.idDocument} className="document-item">
                  <div className="document-item__info">
                    <span className="document-item__type">
                      {TYPE_LABELS[doc.typeDocument] ?? doc.typeDocument}
                    </span>
                    <span className="document-item__nom">{doc.nomFichier}</span>
                    <span className="document-item__taille">
                      {(doc.tailleFichier / 1024).toFixed(0)} Ko
                    </span>
                  </div>
                  <a
                    href={getUrlTelechargementDocument(doc.idDocument)}
                    className="table-action"
                    download={doc.nomFichier}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telecharger
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!candidature.documents || candidature.documents.length === 0) && (
          <p className="candidature-detail__no-doc">Aucun document joint.</p>
        )}
      </div>
    </div>
  );
}
