import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
    createDomaineEtude,
    deleteDomaineEtude,
    getDomainesEtudes,
    updateDomaineEtude
} from '../../services/domaineEtudeService';
import { getColleges } from '../../services/collegeService';

const initialForm = {
    nom: '',
    code: '',
    idCollege: '',
    accepteStagiaires: true,
    actif: true
};

function getErrorMessage(error) {
    const data = error.response?.data;

    if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
    }

    return data?.message ?? data?.title ?? 'Une erreur est survenue.';
}

export function DomainesEtudesPage() {
    const [domaines, setDomaines] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [selectedDomaine, setSelectedDomaine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function loadData() {
        setLoading(true);
        setError('');

        try {
            const [domainesData, collegesData] = await Promise.all([
                getDomainesEtudes(),
                getColleges()
            ]);

            setDomaines(domainesData);
            setColleges(collegesData);
        } catch (e) {
            setError(getErrorMessage(e) || 'Impossible de charger les donn\u00e9es.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleEdit(domaine) {
        setSelectedDomaine(domaine);
        setForm({
            nom: domaine.nom ?? '',
            code: domaine.code ?? '',
            idCollege: domaine.idCollege?.toString() ?? '',
            accepteStagiaires: domaine.accepteStagiaires ?? true,
            actif: domaine.actif ?? true
        });
        setMessage('');
        setError('');
    }

    function handleCancelEdit() {
        setSelectedDomaine(null);
        setForm(initialForm);
        setMessage('');
        setError('');
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setMessage('');
        setError('');

        const payload = {
            idCollege: Number(form.idCollege),
            nom: form.nom.trim(),
            code: form.code.trim(),
            accepteStagiaires: form.accepteStagiaires,
            actif: form.actif
        };

        if (!payload.nom || !payload.code || !payload.idCollege) {
            setError('Le nom, le code et le c\u00e9gep sont obligatoires.');
            setSaving(false);
            return;
        }

        try {
            if (selectedDomaine) {
                await updateDomaineEtude(selectedDomaine.idDomaine, payload);
                setMessage('Domaine d\u2019\u00e9tudes modifi\u00e9 avec succ\u00e8s.');
            } else {
                await createDomaineEtude(payload);
                setMessage('Domaine d\u2019\u00e9tudes cr\u00e9\u00e9 avec succ\u00e8s.');
            }

            setSelectedDomaine(null);
            setForm(initialForm);
            await loadData();
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(domaine) {
        const confirmation = window.confirm(
            `D\u00e9sactiver le domaine "${domaine.nom}" ?`
        );

        if (!confirmation) return;

        setMessage('');
        setError('');

        try {
            await deleteDomaineEtude(domaine.idDomaine);
            setMessage('Domaine d\u2019\u00e9tudes d\u00e9sactiv\u00e9 avec succ\u00e8s.');
            await loadData();
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    return (
        <AppLayout>
            <section className="page-header">
                <div>
                    <p className="page-kicker">Administration</p>
                    <h1>Gestion des domaines d&rsquo;&eacute;tudes</h1>
                    <p>
                        Cr&eacute;ez, modifiez et d&eacute;sactivez les domaines d&rsquo;&eacute;tudes disponibles sur la plateforme.
                    </p>
                </div>
            </section>

            {message && <p className="notice notice-success">{message}</p>}
            {error && <p className="notice notice-error">{error}</p>}

            <section className="admin-grid">
                <div className="panel">
                    <h2>
                        {selectedDomaine
                            ? 'Modifier un domaine d\u2019\u00e9tudes'
                            : 'Cr\u00e9er un domaine d\u2019\u00e9tudes'}
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
                                    placeholder="Ex. Informatique"
                                />
                            </label>

                            <label>
                                Code
                                <input
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    placeholder="Ex. INFO"
                                />
                            </label>

                            <label>
                                C&eacute;gep
                                <select
                                    name="idCollege"
                                    value={form.idCollege}
                                    onChange={handleChange}
                                >
                                    <option value="">S&eacute;lectionner un c&eacute;gep</option>
                                    {colleges.map((college) => (
                                        <option key={college.idCollege} value={college.idCollege}>
                                            {college.nom}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>
                                    <input
                                        type="checkbox"
                                        name="accepteStagiaires"
                                        checked={form.accepteStagiaires}
                                        onChange={handleChange}
                                        style={{ marginRight: '8px' }}
                                    />
                                    Accepte les stagiaires
                                </span>
                            </label>

                            <label>
                                <span>
                                    <input
                                        type="checkbox"
                                        name="actif"
                                        checked={form.actif}
                                        onChange={handleChange}
                                        style={{ marginRight: '8px' }}
                                    />
                                    Domaine actif
                                </span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary-action" disabled={saving}>
                                {saving
                                    ? 'Enregistrement...'
                                    : selectedDomaine
                                        ? 'Modifier'
                                        : 'Cr\u00e9er'}
                            </button>

                            {selectedDomaine && (
                                <button
                                    type="button"
                                    className="secondary-action"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="panel admin-list-panel">
                    <h2>Domaines d&rsquo;&eacute;tudes</h2>

                    {loading ? (
                        <p>Chargement...</p>
                    ) : domaines.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun domaine d&rsquo;&eacute;tudes trouv&eacute;.</p>
                        </div>
                    ) : (
                        <div className="table-shell">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Code</th>
                                        <th>C&eacute;gep</th>
                                        <th>Stagiaires</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {domaines.map((domaine) => (
                                        <tr key={domaine.idDomaine}>
                                            <td>{domaine.nom}</td>
                                            <td>{domaine.code}</td>
                                            <td>{domaine.nomCollege}</td>
                                            <td>
                                                <span className={domaine.accepteStagiaires ? 'badge badge-success' : 'badge badge-muted'}>
                                                    {domaine.accepteStagiaires ? 'Oui' : 'Non'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={domaine.actif ? 'badge badge-success' : 'badge badge-muted'}>
                                                    {domaine.actif ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        type="button"
                                                        className="secondary-action"
                                                        onClick={() => handleEdit(domaine)}
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="danger-action"
                                                        onClick={() => handleDelete(domaine)}
                                                    >
                                                        D&eacute;sactiver
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
