import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { CandidatureTable } from '../../components/candidatures/CandidatureTable';
import { CandidatureDetail } from '../../components/candidatures/CandidatureDetail';
import {
  getCandidaturesOffre,
  getCandidatureDetail,
  changerStatutCandidature,
} from '../../services/candidatureService';
import { getOffres } from '../../services/offreService';

const VUE_LISTE = 'liste';
const VUE_DETAIL = 'detail';

export function CandidaturesRecuesPage() {
  const [vue, setVue] = useState(VUE_LISTE);
  const [offres, setOffres] = useState([]);
  const [idOffreSelectionnee, setIdOffreSelectionnee] = useState('');
  const [candidatures, setCandidatures] = useState([]);
  const [candidatureDetail, setCandidatureDetail] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(null);

  // Charger les offres de l'employeur au montage
  useEffect(() => {
    getOffres(undefined, 'Active')
      .then(setOffres)
      .catch((e) => setErreur(e.response?.data?.message ?? e.message));
  }, []);

  // Charger les candidatures quand l'offre change
  useEffect(() => {
    if (!idOffreSelectionnee) {
      setCandidatures([]);
      return;
    }
    chargerCandidatures(idOffreSelectionnee);
  }, [idOffreSelectionnee]);

  async function chargerCandidatures(idOffre) {
    setChargement(true);
    setErreur(null);
    try {
      const data = await getCandidaturesOffre(idOffre);
      setCandidatures(data);
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
    } finally {
      setChargement(false);
    }
  }

  async function handleVoirDetail(idCandidature) {
    setErreur(null);
    try {
      const detail = await getCandidatureDetail(idCandidature);
      setCandidatureDetail(detail);
      setVue(VUE_DETAIL);
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
    }
  }

  async function handleChangerStatut(idCandidature, statut) {
    try {
      await changerStatutCandidature(idCandidature, statut);
      setCandidatures((prev) =>
        prev.map((c) =>
          c.idCandidature === idCandidature ? { ...c, statut } : c
        )
      );
      afficherSucces('Statut mis a jour.');
    } catch (e) {
      setErreur(e.response?.data?.message ?? e.message);
    }
  }

  function afficherSucces(msg) {
    setSucces(msg);
    setTimeout(() => setSucces(null), 3000);
  }

  // ── Rendu detail ──────────────────────────────────────────────────────────

  if (vue === VUE_DETAIL && candidatureDetail) {
    return (
      <AppLayout>
        <div className="page-header">
          <p className="page-kicker">Candidatures recues</p>
          <h1>Detail de la candidature</h1>
        </div>
        <CandidatureDetail
          candidature={candidatureDetail}
          onRetour={() => setVue(VUE_LISTE)}
        />
      </AppLayout>
    );
  }

  // ── Rendu liste ───────────────────────────────────────────────────────────

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Employeur</p>
        <h1>Candidatures recues</h1>
        <p>Consultez et gerez les candidatures pour vos offres.</p>
      </div>

      {succes && <p className="notice notice-success">{succes}</p>}
      {erreur && <p className="notice notice-error">{erreur}</p>}

      <div className="panel" style={{ marginBottom: '16px' }}>
        <label className="offre-filters__label">
          Selectionner une offre
          <select
            className="offre-filters__select"
            value={idOffreSelectionnee}
            onChange={(e) => setIdOffreSelectionnee(e.target.value)}
            style={{ maxWidth: '400px' }}
          >
            <option value="">-- Choisir une offre --</option>
            {offres.map((o) => (
              <option key={o.idOffre} value={o.idOffre}>
                {o.titre} ({o.typeOffre})
              </option>
            ))}
          </select>
        </label>
      </div>

      {idOffreSelectionnee && (
        <div className="panel">
          {chargement
            ? <p>Chargement...</p>
            : (
              <CandidatureTable
                candidatures={candidatures}
                onVoirDetail={handleVoirDetail}
                onChangerStatut={handleChangerStatut}
              />
            )
          }
        </div>
      )}
    </AppLayout>
  );
}
