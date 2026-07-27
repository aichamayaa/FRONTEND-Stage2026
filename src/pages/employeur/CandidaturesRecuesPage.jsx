import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { CandidatureTable } from '../../components/candidatures/CandidatureTable';
import { CandidatureDetail } from '../../components/candidatures/CandidatureDetail';
import {
    getCandidaturesOffre,
    getCandidaturesParDomaine,
    getCandidatureDetail,
    changerStatutCandidature,
    confirmerEmploi,
} from '../../services/candidatureService';
import { getMesOffres } from '../../services/offreService';
import { getDomainesEtudes } from '../../services/domaineEtudeService';

const VUE_LISTE = 'liste';
const VUE_DETAIL = 'detail';

export function CandidaturesRecuesPage() {
    const [vue, setVue] = useState(VUE_LISTE);
    const [modeFiltre, setModeFiltre] = useState('offre'); // 'offre' | 'domaine'
    const [offres, setOffres] = useState([]);
    const [domaines, setDomaines] = useState([]);
    const [idOffreSelectionnee, setIdOffreSelectionnee] = useState('');
    const [idDomaineSelectionne, setIdDomaineSelectionne] = useState('');
    const [candidatures, setCandidatures] = useState([]);
    const [candidatureDetail, setCandidatureDetail] = useState(null);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState(null);
    const [succes, setSucces] = useState(null);

    const offreSelectionnee = offres.find(
        (o) => o.idOffre.toString() === idOffreSelectionnee.toString()
    );

    // Charger les offres + domaines de l'employeur connecte au montage
    useEffect(() => {
        getMesOffres()
            .then(setOffres)
            .catch((e) => setErreur(e.response?.data?.message ?? e.message));
        getDomainesEtudes()
            .then(setDomaines)
            .catch(() => { /* silencieux */ });
    }, []);

    // Charger les candidatures selon le filtre actif
    useEffect(() => {
        if (modeFiltre === 'offre') {
            if (!idOffreSelectionnee) {
                setCandidatures([]);
                return;
            }
            chargerCandidatures(() => getCandidaturesOffre(idOffreSelectionnee));
        } else {
            if (!idDomaineSelectionne) {
                setCandidatures([]);
                return;
            }
            chargerCandidatures(() => getCandidaturesParDomaine(idDomaineSelectionne));
        }
    }, [modeFiltre, idOffreSelectionnee, idDomaineSelectionne]);

    async function chargerCandidatures(fetcher) {
        setChargement(true);
        setErreur(null);
        try {
            const data = await fetcher();
            setCandidatures(data);
        } catch (e) {
            setErreur(e.response?.data?.message ?? e.message);
        } finally {
            setChargement(false);
        }
    }

    function changerMode(mode) {
        setModeFiltre(mode);
        setIdOffreSelectionnee('');
        setIdDomaineSelectionne('');
        setCandidatures([]);
        setErreur(null);
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
        let message = null;

        if (statut === 'Acceptee' || statut === 'Refusee') {
            message = window.prompt(
                "Message de réponse pour l'étudiant (optionnel) :",
                statut === 'Acceptee'
                    ? 'Votre candidature a été acceptée.'
                    : 'Votre candidature a été refusée.'
            );

            if (message === null) return;
        }

        try {
            await changerStatutCandidature(idCandidature, statut, message?.trim() || null);

            setCandidatures((prev) =>
                prev.map((c) =>
                    c.idCandidature === idCandidature
                        ? { ...c, statut, messageReponseEmployeur: message?.trim() || null }
                        : c
                )
            );

            if (candidatureDetail?.idCandidature === idCandidature) {
                setCandidatureDetail((prev) =>
                    prev
                        ? { ...prev, statut, messageReponseEmployeur: message?.trim() || null }
                        : prev
                );
            }

            afficherSucces('Statut mis à jour.');
        } catch (e) {
            setErreur(e.response?.data?.message ?? e.message);
        }
    }

    async function handleConfirmerEmploi(idCandidature) {
        const message = window.prompt(
            "Message de confirmation pour l'étudiant :",
            "Emploi confirmé par l'employeur."
        );

        if (message === null) return;

        const messageConfirmation = message.trim() || "Emploi confirmé par l'employeur.";
        const dateConfirmation = new Date().toISOString();

        setErreur(null);

        try {
            await confirmerEmploi(idCandidature, messageConfirmation);

            setCandidatures((prev) =>
                prev.map((c) =>
                    c.idCandidature === idCandidature
                        ? {
                            ...c,
                            emploiConfirme: true,
                            messageConfirmationEmploi: messageConfirmation,
                            dateConfirmationEmploi: dateConfirmation,
                        }
                        : c
                )
            );

            if (candidatureDetail?.idCandidature === idCandidature) {
                setCandidatureDetail((prev) =>
                    prev
                        ? {
                            ...prev,
                            emploiConfirme: true,
                            messageConfirmationEmploi: messageConfirmation,
                            dateConfirmationEmploi: dateConfirmation,
                        }
                        : prev
                );
            }

            afficherSucces('Emploi confirmé avec succès.');
        } catch (e) {
            setErreur(e.response?.data?.message ?? e.message);
        }
    }

    function afficherSucces(msg) {
        setSucces(msg);
        setTimeout(() => setSucces(null), 3000);
    }

    if (vue === VUE_DETAIL && candidatureDetail) {
        return (
            <AppLayout>
                <div className="page-header">
                    <p className="page-kicker">Candidatures reçues</p>
                    <h1>Détail de la candidature</h1>
                </div>

                {succes && <p className="notice notice-success">{succes}</p>}
                {erreur && <p className="notice notice-error">{erreur}</p>}

                <CandidatureDetail
                    candidature={candidatureDetail}
                    onRetour={() => setVue(VUE_LISTE)}
                />
            </AppLayout>
        );
    }

    const aUneSelection =
        (modeFiltre === 'offre' && idOffreSelectionnee) ||
        (modeFiltre === 'domaine' && idDomaineSelectionne);

    return (
        <AppLayout>
            <div className="page-header">
                <p className="page-kicker">Employeur</p>
                <h1>Candidatures reçues</h1>
                <p>Consultez et gérez les candidatures pour vos offres, par offre ou par domaine.</p>
            </div>

            {succes && <p className="notice notice-success">{succes}</p>}
            {erreur && <p className="notice notice-error">{erreur}</p>}

            <div className="panel" style={{ marginBottom: '16px' }}>
                <div className="offre-filters">
                    <label className="offre-filters__label">
                        Filtrer par
                        <select
                            className="offre-filters__select"
                            value={modeFiltre}
                            onChange={(e) => changerMode(e.target.value)}
                        >
                            <option value="offre">Offre</option>
                            <option value="domaine">Domaine</option>
                        </select>
                    </label>

                    {modeFiltre === 'offre' ? (
                        <label className="offre-filters__label">
                            Offre
                            <select
                                className="offre-filters__select"
                                value={idOffreSelectionnee}
                                onChange={(e) => setIdOffreSelectionnee(e.target.value)}
                                style={{ minWidth: '260px' }}
                            >
                                <option value="">-- Choisir une offre --</option>
                                {offres.map((o) => (
                                    <option key={o.idOffre} value={o.idOffre}>
                                        {o.titre} ({o.typeOffre})
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : (
                        <label className="offre-filters__label">
                            Domaine
                            <select
                                className="offre-filters__select"
                                value={idDomaineSelectionne}
                                onChange={(e) => setIdDomaineSelectionne(e.target.value)}
                                style={{ minWidth: '260px' }}
                            >
                                <option value="">-- Choisir un domaine --</option>
                                {domaines.map((d) => (
                                    <option key={d.idDomaine} value={d.idDomaine}>
                                        {d.nom}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                </div>
            </div>

            {aUneSelection && (
                <div className="panel">
                    {chargement ? (
                        <p>Chargement...</p>
                    ) : (
                        <CandidatureTable
                            candidatures={candidatures}
                            onVoirDetail={handleVoirDetail}
                            onChangerStatut={handleChangerStatut}
                            onConfirmerEmploi={handleConfirmerEmploi}
                            isOffreEmploi={modeFiltre === 'offre' && offreSelectionnee?.typeOffre === 'Emploi'}
                        />
                    )}
                </div>
            )}
        </AppLayout>
    );
}
