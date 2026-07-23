import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { CandidatureTable } from '../../components/candidatures/CandidatureTable';
import { CandidatureDetail } from '../../components/candidatures/CandidatureDetail';
import {
    getCandidaturesOffre,
    getCandidatureDetail,
    changerStatutCandidature,
    confirmerEmploi,
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

    // Ajout d'un assistant d'offre sélectionné
    const offreSelectionnee = offres.find(
        (o) => o.idOffre.toString() === idOffreSelectionnee.toString()
    );

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

    // Modifié pour US - 14
    async function handleChangerStatut(idCandidature, statut) {
        let message = null;

        if (statut === 'Acceptee' || statut === 'Refusee') {
            message = window.prompt(
                "Message de réponse pour l'étudiant (optionnel) :",
                statut === 'Acceptee'
                    ? 'Votre candidature a été acceptée.'
                    : 'Votre candidature a été refusée.'
            );

            if (message === null) return; // Si l'employeur clique 
        }

        // Appelle l'API backend
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

            afficherSucces('Statut mis a jour.');
        } catch (e) {
            setErreur(e.response?.data?.message ?? e.message);
        }
    }

    // Ajout d'un gestionnaire pour la confirmation d'un emploi par un id de candidature
    async function handleConfirmerEmploi(idCandidature) {
        const message = window.prompt(
            "Message de confirmation pour l'étudiant :",
            "Emploi confirmé par l'employeur."
        );

        if (message === null) return;

        const messageConfirmation =
            message.trim() || "Emploi confirmé par l'employeur.";

        const dateConfirmation = new Date().toISOString();

        setErreur(null);

        try {
            await confirmerEmploi(
                idCandidature,
                messageConfirmation
            );

            setCandidatures((prev) =>
                prev.map((c) =>
                    c.idCandidature === idCandidature
                        ? {
                            ...c,
                            emploiConfirme: true,
                            messageConfirmationEmploi:
                                messageConfirmation,
                            dateConfirmationEmploi:
                                dateConfirmation,
                        }
                        : c
                )
            );

            if (
                candidatureDetail?.idCandidature ===
                idCandidature
            ) {
                setCandidatureDetail((prev) =>
                    prev
                        ? {
                            ...prev,
                            emploiConfirme: true,
                            messageConfirmationEmploi:
                                messageConfirmation,
                            dateConfirmationEmploi:
                                dateConfirmation,
                        }
                        : prev
                );
            }

            afficherSucces(
                "Emploi confirmé avec succès."
            );
        } catch (e) {
            setErreur(
                e.response?.data?.message ?? e.message
            );
        }
    }

    function afficherSucces(msg) {
        setSucces(msg);
        setTimeout(() => setSucces(null), 3000);
    }

    // Rendu detail 
    if (vue === VUE_DETAIL && candidatureDetail) {
        return (
            <AppLayout>
                <div className="page-header">
                    <p className="page-kicker">Candidatures recues</p>
                    <h1>Detail de la candidature</h1>
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

    // Rendu liste
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
                                onConfirmerEmploi={handleConfirmerEmploi}
                                isOffreEmploi={offreSelectionnee?.typeOffre === 'Emploi'}
                            />
                        )
                    }
                </div>
            )}
        </AppLayout>
    );
}
