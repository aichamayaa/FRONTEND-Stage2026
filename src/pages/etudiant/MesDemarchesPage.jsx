import { formatDateTime } from '../../utils/formatDate';
import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { suiviService } from '../../services/suiviService';

export function MesDemarchesPage() {
  const [demarches, setDemarches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerDemarches() {
      const data = await suiviService.getMesDémarches();
      setDemarches(data);
      setLoading(false);
    }

    chargerDemarches();
  }, []);

  return (
    <AppLayout>
      <section className="page-header">
        <p className="page-kicker">Étudiant</p>
        <h1>Mes démarches de suivi</h1>
        <p>
          Consultez les rencontres, appels et suivis partagés par votre
          responsable de stage.
        </p>
      </section>

      <section className="panel">
        {loading && <p>Chargement des démarches...</p>}

        {!loading && demarches.length === 0 && (
          <div className="empty-state">
            <h2>Aucune démarche visible</h2>
            <p>
              Votre responsable de stage n’a pas encore partagé de démarche avec
              vous.
            </p>
          </div>
        )}

        {!loading && demarches.length > 0 && (
          <div className="documents-liste">
            {demarches.map((demarche) => (
              <article className="document-item" key={demarche.idDemarche}>
                <div>
                  <strong>{demarche.typeDemarche}</strong>
                  <p>{demarche.note}</p>
                </div>
                <span>
                  {formatDateTime(demarche.dateDemarche)}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}