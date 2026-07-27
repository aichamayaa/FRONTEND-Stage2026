import { formatDate } from '../../utils/formatDate';
import { telechargerDocument } from '../../services/candidatureService';

const STATUT_LABELS = {
    EnAttente: 'En attente',
    Vue: 'Vue',
    Acceptee: 'Acceptée',
    Refusee: 'Refusée',
};

const TYPE_LABELS = {
    CV: 'CV',
    LettreMotivation: 'Lettre de motivation',
    Autre: 'Autre',
};

export function CandidatureDetail({ candidature, onRetour }) {
    if (!candidature) return null;

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

            <div className="panel" style={{ marginBottom: '16px', background: '#003D7D', color: '#fff', borderRadius: '6px', padding: '20px 24px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '0.85rem', opacity: 0.8 }}>Offre</p>
                <h2 style={{ margin: '0 0 6px', fontSize: '1.3rem' }}>{candidature.titreOffre}</h2>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.85 }}>
                    Candidature re&ccedil;ue le {formatDate(candidature.dateCandidature)}
                </p>
            </div>

            <div className="panel">
                <div className="candidature-detail__header">
                    <div>
                        <h2 className="candidature-detail__nom">
                            {candidature.prenomEtudiant} {candidature.nomEtudiant}
                        </h2>
                        {candidature.courrielEtudiant && (
                            <p className="candidature-detail__email">{candidature.courrielEtudiant}</p>
                        )}
                        {candidature.emailEtudiant && !candidature.courrielEtudiant && (
                            <p className="candidature-detail__email">{candidature.emailEtudiant}</p>
                        )}
                    </div>
                    <span className={`badge ${candidature.statut === 'Acceptee' ? 'badge-success' : 'badge-muted'}`}>
                        {STATUT_LABELS[candidature.statut] ?? candidature.statut}
                    </span>
                </div>

                {candidature.messageMotivation && (
                    <div className="candidature-detail__message">
                        <h3>Message de motivation</h3>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{candidature.messageMotivation}</p>
                    </div>
                )}

                {/* Ajout de la réponse de l'employeur si elle existe, avec la date de réponse */}
                {candidature.messageReponseEmployeur && (
                    <div className="candidature-detail__message">
                        <h3>Réponse de l&#39;employeur</h3>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{candidature.messageReponseEmployeur}</p>
                        {candidature.dateReponseEmployeur && (
                            <p className="candidature-detail__date">
                                Réponse envoyée le {formatDate(candidature.dateReponseEmployeur)}
                            </p>
                        )}
                    </div>
                )}

                {candidature.emploiConfirme && (
                    <div className="candidature-detail__message">
                        <h3>Confirmation de l&#39;emploi</h3>

                        <p style={{ whiteSpace: 'pre-wrap' }}>
                            {candidature.messageConfirmationEmploi ||
                                "Emploi confirmé par l'employeur."}
                        </p>

                        {candidature.dateConfirmationEmploi && (
                            <p className="candidature-detail__date">
                                Emploi confirmé le{' '}
                                {formatDate(candidature.dateConfirmationEmploi)}
                            </p>
                        )}
                    </div>
                )}

                {candidature.documents?.length > 0 && (
                    <div className="candidature-detail__documents">
                        <h3>Documents</h3>
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
                                    <button
                                        type="button"
                                        className="table-action"
                                        onClick={() => telechargerDocument(doc.idDocument, doc.nomFichier)}
                                    >
                                        Télécharger
                                    </button>
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
