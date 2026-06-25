import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { OffreFilters } from '../../components/offres/OffreFilters';
import { OffreTable } from '../../components/offres/OffreTable';
import { OffreForm } from '../../components/offres/OffreForm';
import {
  getOffres,
  getOffreById,
  creerOffreEmploi,
  creerOffreStage,
  modifierOffreEmploi,
  modifierOffreStage,
  supprimerOffre,
} from '../../services/offreService';

// Vue : liste | detail | form-emploi | form-stage
const VUE_LISTE = 'liste';
const VUE_DETAIL = 'detail';
const VUE_FORM_EMPLOI = 'form-emploi';
const VUE_FORM_STAGE = 'form-stage';

export function OffresEmployeurPage() {
  const [vue, setVue] = useState(VUE_LISTE);
  const [offres, setOffres] = useState([]);
  const [offreSelectionnee, setOffreSelectionnee] = useState(null);
  const [filtreType, setFiltreType] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [chargement, setChargement] = useState(false);
  const [chargementForm, setChargementForm] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [erreurForm, setErreurForm] = useState(null);
  const [succes, setSucces] = useState(null);

  useEffect(() => {
    chargerOffres();
  }, [filtreType, filtreStatut]);

  async function chargerOffres() {
    setChargement(true);
    setErreur(null);
    try {
      const data = await getOffres(filtreType || undefined, filtreStatut || undefined);
      setOffres(data);
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
    } finally {
      setChargement(false);
    }
  }

  async function handleVoir(idOffre) {
    setErreur(null);
    try {
      const offre = await getOffreById(idOffre);
      setOffreSelectionnee(offre);
      setVue(VUE_DETAIL);
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
    }
  }

  function handleNouvelleOffre(type) {
    setOffreSelectionnee(null);
    setErreurForm(null);
    setVue(type === 'Stage' ? VUE_FORM_STAGE : VUE_FORM_EMPLOI);
  }

  function handleModifier(offre) {
    setOffreSelectionnee(offre);
    setErreurForm(null);
    setVue(offre.typeOffre === 'Stage' ? VUE_FORM_STAGE : VUE_FORM_EMPLOI);
  }

  async function handleSupprimer(idOffre) {
    try {
      await supprimerOffre(idOffre);
      setOffres((prev) => prev.filter((o) => o.idOffre !== idOffre));
      afficherSucces('Offre supprimee avec succes.');
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
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
        afficherSucces('Offre modifiee avec succes.');
      } else {
        if (isStage) {
          await creerOffreStage(payload);
        } else {
          await creerOffreEmploi(payload);
        }
        afficherSucces('Offre publiee avec succes.');
      }

      setVue(VUE_LISTE);
      chargerOffres();
    } catch (e) {
      setErreurForm(e.response?.data?.message ?? e.message ?? 'Une erreur est survenue.');
    } finally {
      setChargementForm(false);
    }
  }

  function afficherSucces(msg) {
    setSucces(msg);
    setTimeout(() => setSucces(null), 4000);
  }

  // ── Rendu : formulaire ──────────────────────────────────────────────────

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
                : 'Nouvelle offre d\'emploi'}
          </h1>
        </div>

        <div className="panel">
          <OffreForm
            typeOffre={vue === VUE_FORM_STAGE ? 'Stage' : 'Emploi'}
            initial={offreSelectionnee ?? undefined}
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

  // ── Rendu : detail ────────────────────────────────────────────────────────

  if (vue === VUE_DETAIL && offreSelectionnee) {
    const o = offreSelectionnee;
    return (
      <AppLayout>
        <div className="page-header">
          <p className="page-kicker">
            {o.typeOffre === 'Stage' ? 'Stage' : 'Emploi'} &middot; {o.statut}
          </p>
          <h1>{o.titre}</h1>
          <p>{o.nomEmployeur} &mdash; {o.ville}</p>
        </div>

        <div className="panel">
          <button
            type="button"
            className="secondary-action"
            style={{ marginBottom: '20px' }}
            onClick={() => setVue(VUE_LISTE)}
          >
            Retour a la liste
          </button>

          <p style={{ whiteSpace: 'pre-wrap' }}>{o.description}</p>

          {o.typeOffre === 'Emploi' && (
            <dl className="offre-detail__dl">
              {o.typeContrat && <><dt>Type de contrat</dt><dd>{o.typeContrat}</dd></>}
              {o.teleTravail && <><dt>Teletravail</dt><dd>{o.teleTravail}</dd></>}
              {o.salaireMin != null && (
                <><dt>Salaire</dt><dd>{o.salaireMin} {o.salaireMax ? `- ${o.salaireMax}` : ''}</dd></>
              )}
            </dl>
          )}

          {o.typeOffre === 'Stage' && (
            <dl className="offre-detail__dl">
              {o.session && <><dt>Session</dt><dd>{o.session}</dd></>}
              {o.dateDebutStage && <><dt>Debut</dt><dd>{o.dateDebutStage?.slice(0, 10)}</dd></>}
              {o.dateFinStage && <><dt>Fin</dt><dd>{o.dateFinStage?.slice(0, 10)}</dd></>}
              {o.dureeHeuresParSemaine != null && (
                <><dt>Heures/semaine</dt><dd>{o.dureeHeuresParSemaine} h</dd></>
              )}
              {o.remuneration != null && <><dt>Remuneration</dt><dd>{o.remuneration} $/h</dd></>}
            </dl>
          )}

          <div className="table-actions" style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="primary-action"
              onClick={() => handleModifier(o)}
            >
              Modifier
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Rendu : liste ─────────────────────────────────────────────────────────

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Employeur</p>
        <h1>Mes offres</h1>
        <p>Gerez vos offres d&apos;emploi et de stage.</p>
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

      {chargement
        ? <p>Chargement...</p>
        : (
          <div className="panel" style={{ marginTop: '16px' }}>
            <OffreTable
              offres={offres}
              isEmployeur
              onVoir={handleVoir}
              onModifier={handleModifier}
              onSupprimer={handleSupprimer}
            />
          </div>
        )
      }
    </AppLayout>
  );
}
