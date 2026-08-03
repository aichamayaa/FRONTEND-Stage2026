import { useCallback, useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { OffreFilters } from '../../components/offres/OffreFilters';
import { OffreTable } from '../../components/offres/OffreTable';
import { OffreForm } from '../../components/offres/OffreForm';
import { formatStatus } from '../../utils/formatStatus';
import { OffrePdfActions } from '../../components/offres/OffrePdfActions';
import { getDomainesEtudes } from '../../services/domaineEtudeService';
import {
  getMesOffres,
  getOffreById,
  creerOffreEmploi,
  creerOffreStage,
  modifierOffreEmploi,
  modifierOffreStage,
  supprimerOffre,
} from '../../services/offreService';

const VUE_LISTE = 'liste';
const VUE_DETAIL = 'detail';
const VUE_FORM_EMPLOI = 'form-emploi';
const VUE_FORM_STAGE = 'form-stage';

function messageErreur(e) {
  const data = e.response?.data;

  if (data?.errors) {
    return Object.values(data.errors).flat().join(' ');
  }

  return data?.message ?? data?.title ?? e.message;
}

function domaineAccepteStagiaires(domaine) {
  // Nouvelle logique : le domaine est global et peut être lié à plusieurs cégeps.
  return domaine.colleges?.some(
    (college) => college.actif && college.accepteStagiaires
  );
}

export function OffresEmployeurPage() {
  const [vue, setVue] = useState(VUE_LISTE);
  const [offres, setOffres] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [offreSelectionnee, setOffreSelectionnee] = useState(null);
  const [filtreType, setFiltreType] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [chargement, setChargement] = useState(false);
  const [chargementForm, setChargementForm] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [erreurForm, setErreurForm] = useState(null);
  const [succes, setSucces] = useState(null);

  const chargerOffres = useCallback(async () => {
    setChargement(true);
    setErreur(null);

    try {
      const data = await getMesOffres();

      const offresFiltrees = data.filter((offre) => {
        const typeOk = filtreType ? offre.typeOffre === filtreType : true;
        const statutOk = filtreStatut ? offre.statut === filtreStatut : true;

        return typeOk && statutOk;
      });

      setOffres(offresFiltrees);
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setChargement(false);
    }
  }, [filtreType, filtreStatut]);

  useEffect(() => {
    chargerOffres();
  }, [chargerOffres]);

  useEffect(() => {
    async function chargerDomaines() {
      try {
        const data = await getDomainesEtudes();

        // On garde les domaines globaux actifs qui sont disponibles dans au moins un cégep.
        const domainesDisponibles = data.filter(
          (domaine) => domaine.actif && domaineAccepteStagiaires(domaine)
        );

        setDomaines(domainesDisponibles);
      } catch (e) {
        setErreur(messageErreur(e));
      }
    }

    chargerDomaines();
  }, []);

  async function handleVoir(idOffre) {
    setErreur(null);

    try {
      const offre = await getOffreById(idOffre);
      setOffreSelectionnee(offre);
      setVue(VUE_DETAIL);
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  function handleNouvelleOffre(type) {
    setOffreSelectionnee(null);
    setErreurForm(null);
    setVue(type === 'Stage' ? VUE_FORM_STAGE : VUE_FORM_EMPLOI);
  }

  async function handleModifier(offre) {
    setErreur(null);
    setErreurForm(null);

    try {
      const offreComplete = await getOffreById(offre.idOffre);

      setOffreSelectionnee(offreComplete);
      setVue(
        offreComplete.typeOffre === 'Stage'
          ? VUE_FORM_STAGE
          : VUE_FORM_EMPLOI
      );
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function handleSupprimer(idOffre) {
    try {
      await supprimerOffre(idOffre);
      setOffres((prev) => prev.filter((o) => o.idOffre !== idOffre));
      afficherSucces('Offre supprimée avec succès.');
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function handleSubmitForm(payload) {
    setChargementForm(true);
    setErreurForm(null);

    try {
      const isEdit = Boolean(offreSelectionnee);
      const isStage = vue === VUE_FORM_STAGE;

      if (isEdit) {
        if (isStage) {
          await modifierOffreStage(offreSelectionnee.idOffre, payload);
        } else {
          await modifierOffreEmploi(offreSelectionnee.idOffre, payload);
        }

        afficherSucces('Offre modifiée avec succès.');
      } else {
        if (isStage) {
          await creerOffreStage(payload);
        } else {
          await creerOffreEmploi(payload);
        }

        afficherSucces('Offre publiée avec succès.');
      }

      setVue(VUE_LISTE);
      chargerOffres();
    } catch (e) {
      setErreurForm(messageErreur(e) ?? 'Une erreur est survenue.');
    } finally {
      setChargementForm(false);
    }
  }

  function afficherSucces(msg) {
    setSucces(msg);
    setTimeout(() => setSucces(null), 4000);
  }

  if (vue === VUE_FORM_EMPLOI || vue === VUE_FORM_STAGE) {
    return (
      <AppLayout>
        <div className="page-header">
          <p className="page-kicker">Gestion des offres</p>
          <h1>
            {offreSelectionnee
              ? `Modifier - ${offreSelectionnee.titre}`
              : vue === VUE_FORM_STAGE
                ? 'Nouvelle offre de stage'
                : "Nouvelle offre d'emploi"}
          </h1>
        </div>

        <div className="panel">
          <OffreForm
            typeOffre={vue === VUE_FORM_STAGE ? 'Stage' : 'Emploi'}
            initial={offreSelectionnee ?? undefined}
            domaines={domaines}
            onSubmit={handleSubmitForm}
            onAnnuler={() => setVue(VUE_LISTE)}
            isEdit={Boolean(offreSelectionnee)}
            loading={chargementForm}
            error={erreurForm}
          />
        </div>
      </AppLayout>
    );
  }

  if (vue === VUE_DETAIL && offreSelectionnee) {
    const o = offreSelectionnee;

    return (
      <AppLayout>
        <div className="page-header">
          <p className="page-kicker">
            {o.typeOffre === 'Stage' ? 'Stage' : 'Emploi'} · {formatStatus(o.statut)}
          </p>
          <h1>{o.titre}</h1>
          <p>
            {o.nomEmployeur} — {o.ville}
          </p>
        </div>

        <div className="panel">
          <button
            type="button"
            className="secondary-action"
            style={{ marginBottom: '20px' }}
            onClick={() => setVue(VUE_LISTE)}
          >
            Retour à la liste
          </button>

          {o.domaines?.length > 0 && (
            <div className="offre-card__domaines" style={{ marginBottom: '16px' }}>
              {o.domaines.map((domaine) => (
                <span key={domaine} className="badge badge-muted offre-card__domaine-tag">
                  {domaine}
                </span>
              ))}
            </div>
          )}

          <p style={{ whiteSpace: 'pre-wrap' }}>{o.description}</p>

          <div className="table-actions" style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="primary-action"
              onClick={() => handleModifier(o)}
            >
              Modifier
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <OffrePdfActions idOffre={o.idOffre} />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Employeur</p>
        <h1>Mes offres</h1>
        <p>Gérez vos offres d&apos;emploi et de stage.</p>
      </div>

      {succes && <p className="notice notice-success">{succes}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}

      <div className="offres-toolbar">
        <OffreFilters
          filtreType={filtreType}
          filtreStatut={filtreStatut}
          onTypeChange={setFiltreType}
          onStatutChange={setFiltreStatut}
        />

        <div className="form-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => handleNouvelleOffre('Emploi')}
          >
            + Offre d&apos;emploi
          </button>

          <button
            type="button"
            className="primary-action"
            onClick={() => handleNouvelleOffre('Stage')}
          >
            + Offre de stage
          </button>
        </div>
      </div>

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <div className="panel" style={{ marginTop: '16px' }}>
          <OffreTable
            offres={offres}
            isEmployeur
            onVoir={handleVoir}
            onModifier={handleModifier}
            onSupprimer={handleSupprimer}
          />
        </div>
      )}
    </AppLayout>
  );
}