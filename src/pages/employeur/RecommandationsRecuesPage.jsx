import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { getRecommandationsRecues } from '../../services/recommandationService';

function formatDate(date) {
  if (!date) {
    return 'Date inconnue';
  }

  return new Date(date).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function RecommandationsRecuesPage() {
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    async function chargerRecommandations() {
      setLoading(true);
      setErreur('');

      try {
        const data = await getRecommandationsRecues();
        setRecommandations(data);
      } catch {
        setErreur('Impossible de charger les recommandations reçues.');
        setRecommandations([]);
      } finally {
        setLoading(false);
      }
    }

    chargerRecommandations();
  }, []);

  return (
    <AppLayout>
      <section className="page-header">
        <p className="page-kicker">Employeur</p>
        <h1>Recommandations reçues</h1>
        <p>
          Consultez les étudiants recommandés par les responsables de stage et
          proposez une offre directe au besoin.
        </p>
      </section>

      {erreur && <p className="notice notice-error">{erreur}</p>}

      <section className="panel">
        {loading && <p>Chargement des recommandations...</p>}

        {!loading && recommandations.length === 0 && (
          <div className="empty-state">
            <h2>Aucune recommandation reçue</h2>
            <p>
              Aucun responsable de stage ne vous a encore envoyé de
              recommandation.
            </p>
          </div>
        )}

        {!loading && recommandations.length > 0 && (
          <div className="table-shell">
            <table className="table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Responsable</th>
                  <th>Commentaire</th>
                  <th>Lettre</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {recommandations.map((recommandation) => (
                  <tr key={recommandation.idRecommandation}>
                    <td>
                      <strong>
                        {recommandation.prenomEtudiant}{' '}
                        {recommandation.nomEtudiant}
                      </strong>
                    </td>

                    <td>
                      {recommandation.prenomAuteur}{' '}
                      {recommandation.nomAuteur}
                    </td>

                    <td>{recommandation.commentaire}</td>

                    <td>
                      {recommandation.aLettre ? (
                        <a
                          className="table-action"
                          href={`${import.meta.env.VITE_API_BASE_URL}/recommandations/${recommandation.idRecommandation}/lettre`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Télécharger
                        </a>
                      ) : (
                        'Aucune'
                      )}
                    </td>

                    <td>{formatDate(recommandation.dateCreation)}</td>

                    <td>
                      <Link
                        className="table-action"
                        to={`/employeur/offres-stage-directes?idEtudiant=${recommandation.idEtudiant}`}
                      >
                        Faire une offre directe
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppLayout>
  );
}