import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
    createMonProfilEntreprise,
    getMonProfilEntreprise,
    updateMonProfilEntreprise
} from '../../services/entrepriseService';

const initialForm = {
    nom: '',
    secteur: '',
    adresse: '',
    siteWeb: '',
    description: '',
    logoUrl: ''
};

function getErrorMessage(error) {
    const data = error.response?.data;

    if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
    }

    return data?.message ?? data?.title ?? 'Une erreur est survenue.';
}

export function ProfilEntreprisePage() {
    const [entreprise, setEntreprise] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function loadProfil() {
        setLoading(true);
        setError('');

        try {
            const data = await getMonProfilEntreprise();
            setEntreprise(data);
            setForm({
                nom: data.nom ?? '',
                secteur: data.secteur ?? '',
                adresse: data.adresse ?? '',
                siteWeb: data.siteWeb ?? '',
                description: data.description ?? '',
                logoUrl: data.logoUrl ?? ''
            });
        } catch (e) {
            if (e.response?.status === 404) {
                setEntreprise(null);
                setForm(initialForm);
            } else {
                setError(getErrorMessage(e) || 'Impossible de charger le profil de l\u2019entreprise!');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfil();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setMessage('');
        setError('');

        const payload = {
            nom: form.nom.trim(),
            secteur: form.secteur.trim(),
            adresse: form.adresse.trim(),
            siteWeb: form.siteWeb.trim() || null,
            description: form.description.trim() || null,
            logoUrl: form.logoUrl.trim() || null
        };

        if (!payload.nom || !payload.secteur || !payload.adresse) {
            setError("Le nom, le secteur et l'adresse sont obligatoires.");
            setSaving(false);
            return;
        }

        try {
            if (entreprise) {
                await updateMonProfilEntreprise(payload);
                setMessage('Profil de l\u2019entreprise modifi\u00e9 avec succ\u00e8s.');
            } else {
                await createMonProfilEntreprise(payload);
                setMessage('Profil de l\u2019entreprise cr\u00e9\u00e9 avec succ\u00e8s.');
            }

            await loadProfil();
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    }

    return (
        <AppLayout>
            <section className="page-header">
                <div>
                    <p className="page-kicker">Employeur</p>
                    <h1>Profil entreprise</h1>
                    <p>
                        Cr&eacute;ez ou mettez &agrave; jour les informations de votre entreprise afin de pr&eacute;senter votre organisation sur la plateforme.
                    </p>
                </div>
            </section>

            {message && <p className="notice notice-success">{message}</p>}
            {error && <p className="notice notice-error">{error}</p>}

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <section className="admin-grid">
                    <div className="panel">
                        <h2>
                            {entreprise
                                ? 'Modifier mon entreprise'
                                : 'Cr\u00e9er mon entreprise'}
                        </h2>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-grid">
                                <label>
                                    Nom
                                    <input
                                        type="text"
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        placeholder="Ex. TechNova Solutions"
                                    />
                                </label>

                                <label>
                                    Secteur
                                    <input
                                        type="text"
                                        name="secteur"
                                        value={form.secteur}
                                        onChange={handleChange}
                                        placeholder="Ex. Technologies de l'information"
                                    />
                                </label>

                                <label>
                                    Adresse
                                    <input
                                        type="text"
                                        name="adresse"
                                        value={form.adresse}
                                        onChange={handleChange}
                                        placeholder={"Ex. 123 rue Saint-Laurent, Montr\u00e9al"}
                                    />
                                </label>

                                <label>
                                    Site web
                                    <input
                                        type="url"
                                        name="siteWeb"
                                        value={form.siteWeb}
                                        onChange={handleChange}
                                        placeholder="https://entreprise.ca"
                                    />
                                </label>

                                <label>
                                    Logo URL
                                    <input
                                        type="url"
                                        name="logoUrl"
                                        value={form.logoUrl}
                                        onChange={handleChange}
                                        placeholder="https://entreprise.ca/logo.png"
                                    />
                                </label>

                                <label>
                                    Description
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Description de l'entreprise"
                                        rows="5"
                                        style={{
                                            minHeight: '120px',
                                            padding: '8px 10px',
                                            color: 'var(--color-text)',
                                            background: '#f7fbff',
                                            border: '1px solid #b7d8ec',
                                            borderRadius: 'var(--radius-sm)',
                                            resize: 'vertical'
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="primary-action" disabled={saving}>
                                    {saving
                                        ? 'Enregistrement...'
                                        : entreprise
                                            ? 'Modifier le profil de l\u2019entreprise'
                                            : 'Cr\u00e9er le profil de l\u2019entreprise'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="panel admin-list-panel">
                        <h2>Aper&ccedil;u</h2>

                        {entreprise ? (
                            <div>
                                <p>
                                    <strong>Nom :</strong> {entreprise.nom}
                                </p>
                                <p>
                                    <strong>Secteur :</strong> {entreprise.secteur}
                                </p>
                                <p>
                                    <strong>Adresse :</strong> {entreprise.adresse}
                                </p>
                                <p>
                                    <strong>Site web :</strong> {entreprise.siteWeb || '-'}
                                </p>
                                <p>
                                    <strong>Logo :</strong> {entreprise.logoUrl || '-'}
                                </p>
                                <p>
                                    <strong>Description :</strong>
                                </p>
                                <p style={{ whiteSpace: 'pre-wrap' }}>
                                    {entreprise.description || '-'}
                                </p>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>
                                    Aucun profil d&rsquo;entreprise n&rsquo;a encore &eacute;t&eacute; cr&eacute;&eacute; pour cet employeur.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </AppLayout>
    );
}
