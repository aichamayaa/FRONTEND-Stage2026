import { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { rechercherOffres } from '../../services/offreService';
import { OffreCard } from '../../components/offres/OffreCard';
import { CandidatureForm } from '../../components/candidatures/CandidatureForm';
import { OffrePdfActions } from '../../components/offres/OffrePdfActions';

export function RechercheOffresPage() {
  const [type, setType] = useState('');
  const [lieu, setLieu] = useState('');
  const [motsCles, setMotsCles] = useState('');
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [recherchee, setRecherchee] = useState(false);
  const [idOffrePostuler, setIdOffrePostuler] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  async function handleSearch(event) {
    event.preventDefault();
    setChargement(true);
    setErreur(null);
    setIdOffrePostuler(null);

    try {
      const data = await rechercherOffres({
        type: type || undefined,
        lieu: lieu || undefined,
        motsCles: motsCles || undefined
      });
      setOffres(data);
    } catch {
      setErreur('Impossible de récupérer les offres.');
    } finally {
      setChargement(false);
      setRecherchee(true);
    }
  }

  const offreSelectionnee = offres.find((o) => o.idOffre === idOffrePostuler);

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Recherche d’offres</h1>
        <p>Trouvez un emploi ou un stage et postulez en ligne.</p>
      </div>

      <form className="panel" onSubmit={handleSearch}>
        <div className="offre-filters">
          <label className="offre-filters__label">
            Type
            <select
              className="offre-filters__select"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="Emploi">Emploi</option>
              <option value="Stage">Stage</option>
            </select>
          </label>

          <label className="offre-filters__label">
            Lieu
            <input
              className="offre-filters__select"
              placeholder="Ville ou adresse"
              value={lieu}
              onChange={(event) => setLieu(event.target.value)}
            />
          </label>

          <label className="offre-filters__label">
            Mots-clé
            <input
              className="offre-filters__select"
              placeholder="Titre ou description"
              value={motsCles}
              onChange={(event) => setMotsCles(event.target.value)}
            />
          </label>

          <button
            type="submit"
            className="primary-action"
            style={{ alignSelf: 'flex-end' }}
          >
            Rechercher
          </button>
        </div>
      </form>

      {chargement && <p>Chargement...</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}
      {!chargement && recherchee && offres.length === 0 && (
        <p className="notice">Aucune offre trouvé.</p>
      )}
      {confirmation && <p className="notice notice-success">{confirmation}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
          marginTop: 16
        }}
      >
        {offres.map((offre) => (
          <OffreCard
            key={offre.idOffre}
            offre={offre}
            isEmployeur={false}
            onVoir={(id) => {
              setIdOffrePostuler(id);
              setConfirmation(null);
            }}
          />
        ))}
      </div>

      {idOffrePostuler && offreSelectionnee && (
        <section style={{ marginTop: 24 }}>
          <div className="page-header">
            <p className="page-kicker">Candidature</p>
            <h2>Postuler à : {offreSelectionnee.titre}</h2>
            <p>{offreSelectionnee.nomEmployeur} &mdash; {offreSelectionnee.ville}</p>
          </div>

          <div className="panel" style={{ marginBottom: '16px' }}>
            <OffrePdfActions idOffre={idOffrePostuler} />
          </div>

          <CandidatureForm
            idOffre={idOffrePostuler}
            titreOffre={offreSelectionnee.titre}
            onSuccess={(candidature) => {
              const titre = offreSelectionnee.titre ?? "l'offre";
              setConfirmation(
                `Merci d'avoir postulé à : ${titre}. Numéro de confirmation : ${candidature.idCandidature}.`
              );
              setIdOffrePostuler(null);
            }}
          />
        </section>
      )}
    </AppLayout>
  );
}
