import { useEffect, useRef, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { rechercherOffres } from '../../services/offreService';
import { getDomainesEtudes } from '../../services/domaineEtudeService';
import { OffreCard } from '../../components/offres/OffreCard';
import { CandidatureForm } from '../../components/candidatures/CandidatureForm';
import { OffrePdfActions } from '../../components/offres/OffrePdfActions';

function getMessageErreur(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.title ||
    error.message ||
    fallback
  );
}

export function RechercheOffresPage() {
  const [type, setType] = useState('');
  const [idDomaine, setIdDomaine] = useState('');
  const [lieu, setLieu] = useState('');
  const [motsCles, setMotsCles] = useState('');
  const [domaines, setDomaines] = useState([]);
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [recherchee, setRecherchee] = useState(false);
  const [idOffrePostuler, setIdOffrePostuler] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const applySectionRef = useRef(null);

  useEffect(() => {
    async function chargerDomaines() {
      try {
        const data = await getDomainesEtudes();

        setDomaines(
          data.filter(
            (domaine) => domaine.actif && domaine.accepteStagiaires
          )
        );
      } catch (error) {
        setErreur(
          getMessageErreur(error, 'Impossible de charger les domaines.')
        );
      }
    }

    chargerDomaines();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();

    setChargement(true);
    setErreur(null);
    setConfirmation(null);
    setIdOffrePostuler(null);

    try {
      const data = await rechercherOffres({
        type: type || undefined,
        idDomaine: idDomaine || undefined,
        lieu: lieu || undefined,
        motsCles: motsCles || undefined,
      });

      setOffres(data);
    } catch (error) {
      setErreur(
        getMessageErreur(error, 'Impossible de récupérer les offres.')
      );
      setOffres([]);
    } finally {
      setChargement(false);
      setRecherchee(true);
    }
  }

  function ouvrirCandidature(idOffre) {
    setIdOffrePostuler(idOffre);
    setConfirmation(null);

    setTimeout(() => {
      applySectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }

  const offreSelectionnee = offres.find(
    (offre) => offre.idOffre === idOffrePostuler
  );

  return (
    <AppLayout>
      <section className="page-header">
        <p className="page-kicker">Espace étudiant</p>
        <h1>Recherche d&apos;offres</h1>
        <p>Trouvez un emploi ou un stage et postulez en ligne.</p>
      </section>

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
            Domaine
            <select
              className="offre-filters__select"
              value={idDomaine}
              onChange={(event) => setIdDomaine(event.target.value)}
            >
              <option value="">Tous les domaines</option>
              {domaines.map((domaine) => (
                <option key={domaine.idDomaine} value={domaine.idDomaine}>
                  {domaine.nom}
                </option>
              ))}
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
            Mots-clés
            <input
              className="offre-filters__select"
              placeholder="Titre ou description"
              value={motsCles}
              onChange={(event) => setMotsCles(event.target.value)}
            />
          </label>

          <button type="submit" className="primary-action">
            Rechercher
          </button>
        </div>
      </form>

      {chargement && <p>Chargement...</p>}

      {erreur && <p className="notice notice-error">{erreur}</p>}

      {!chargement && recherchee && offres.length === 0 && (
        <p className="notice">Aucune offre trouvée.</p>
      )}

      {confirmation && (
        <p className="notice notice-success">{confirmation}</p>
      )}

      <section className="offres-grid">
        {offres.map((offre) => (
          <OffreCard
            key={offre.idOffre}
            offre={offre}
            isEmployeur={false}
            onVoir={ouvrirCandidature}
          />
        ))}
      </section>

      {idOffrePostuler && offreSelectionnee && (
        <section className="apply-section" ref={applySectionRef}>
          <div className="apply-header">
            <div>
              <p className="page-kicker">Candidature</p>
              <h2>Postuler à cette offre</h2>
              <p>
                Vérifiez les informations de l&apos;offre, puis joignez votre CV
                et votre lettre de motivation.
              </p>
            </div>

            <button
              type="button"
              className="secondary-action"
              onClick={() => setIdOffrePostuler(null)}
            >
              Fermer
            </button>
          </div>

          <div className="apply-grid">
            <aside className="apply-offer-card">
              <span className="badge">
                {offreSelectionnee.typeOffre || 'Offre'}
              </span>

              <h3>{offreSelectionnee.titre}</h3>

              <p className="apply-company">
                {offreSelectionnee.nomEmployeur || 'Employeur non précisé'}
              </p>

              {offreSelectionnee.domaines?.length > 0 && (
                <div className="offre-card__domaines">
                  {offreSelectionnee.domaines.map((domaine) => (
                    <span
                      key={domaine}
                      className="badge badge-muted offre-card__domaine-tag"
                    >
                      {domaine}
                    </span>
                  ))}
                </div>
              )}

              <dl className="apply-offer-info">
                <div>
                  <dt>Lieu</dt>
                  <dd>{offreSelectionnee.ville || 'Non précisé'}</dd>
                </div>

                <div>
                  <dt>Statut</dt>
                  <dd>{offreSelectionnee.statut || 'Non précisé'}</dd>
                </div>
              </dl>

              <div className="apply-pdf-actions">
                <OffrePdfActions idOffre={idOffrePostuler} />
              </div>
            </aside>

            <div className="apply-form-panel">
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
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}