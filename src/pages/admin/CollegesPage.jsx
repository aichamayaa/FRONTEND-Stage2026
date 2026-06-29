import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
    createCollege,
    deleteCollege,
    getColleges,
    updateCollege
} from '../../services/collegeService';

const initialForm = {
    nom: '',
    ville: '',
    actif: true
};

function getErrorMessage(error) {
    const data = error.response?.data;

    if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
    }

    return data?.message ?? data?.title ?? 'Une erreur est survenue.';
}

export function CollegesPage() {
    const [colleges, setColleges] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function loadColleges() {
        setLoading(true);
        setError('');

        try {
            const data = await getColleges();
            setColleges(data);
        } catch (e) {
            setError(getErrorMessage(e) || 'Impossible de charger les c\u00e9geps!');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadColleges();
    }, []);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleEdit(college) {
        setSelectedCollege(college);
        setForm({
            nom: college.nom ?? '',
            ville: college.ville ?? '',
            actif: college.actif ?? true
        });
        setMessage('');
        setError('');
    }

    function handleCancelEdit() {
        setSelectedCollege(null);
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
            nom: form.nom.trim(),
            ville: form.ville.trim(),
            actif: form.actif
        };

        if (!payload.nom || !payload.ville) {
            setError('Le nom et la ville du c\u00e9gep sont obligatoires.');
            setSaving(false);
            return;
        }

        try {
            if (selectedCollege) {
                await updateCollege(selectedCollege.idCollege, payload);
                setMessage('C\u00e9gep modifi\u00e9 avec succ\u00e8s.');
            } else {
                await createCollege(payload);
                setMessage('C\u00e9gep cr\u00e9\u00e9 avec succ\u00e8s.');
            }

            setSelectedCollege(null);
            setForm(initialForm);
            await loadColleges();
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(college) {
        const confirmation = window.confirm(
            `D\u00e9sactiver le c\u00e9gep "${college.nom}" ?`
        );

        if (!confirmation) return;

        setMessage('');
        setError('');

        try {
            await deleteCollege(college.idCollege);
            setMessage('C\u00e9gep d\u00e9sactiv\u00e9 avec succ\u00e8s.');
            await loadColleges();
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }

    return (
        <AppLayout>
            <section className="page-header">
                <div>
                    <p className="page-kicker">Administration</p>
                    <h1>Gestion des c&eacute;geps</h1>
                    <p>
                        Cr&eacute;ez, modifiez et d&eacute;sactivez les c&eacute;geps participants de la plateforme.
                    </p>
                </div>
            </section>

            {message && <p className="notice notice-success">{message}</p>}
            {error && <p className="notice notice-error">{error}</p>}

            <section className="admin-grid">
                <div className="panel">
                    <h2>
                        {selectedCollege
                            ? 'Modifier un c\u00e9gep'
                            : 'Cr\u00e9er un c\u00e9gep'}
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
                                    placeholder={"Ex. C\u00e9gep G\u00e9rald-Godin"}
                                />
                            </label>

                            <label>
                                Ville
                                <input
                                    type="text"
                                    name="ville"
                                    value={form.ville}
                                    onChange={handleChange}
                                    placeholder={"Ex. Montr\u00e9al"}
                                />
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
                                    C&eacute;gep actif
                                </span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary-action" disabled={saving}>
                                {saving
                                    ? 'Enregistrement...'
                                    : selectedCollege
                                        ? 'Modifier'
                                        : 'Cr\u00e9er'}
                            </button>

                            {selectedCollege && (
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
                    <h2>C&eacute;geps</h2>

                    {loading ? (
                        <p>Chargement...</p>
                    ) : colleges.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun c&eacute;gep trouv&eacute;.</p>
                        </div>
                    ) : (
                        <div className="table-shell">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Ville</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {colleges.map((college) => (
                                        <tr key={college.idCollege}>
                                            <td>{college.nom}</td>
                                            <td>{college.ville}</td>
                                            <td>
                                                <span className={college.actif ? 'badge badge-success' : 'badge badge-muted'}>
                                                    {college.actif ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        type="button"
                                                        className="secondary-action"
                                                        onClick={() => handleEdit(college)}
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="danger-action"
                                                        onClick={() => handleDelete(college)}
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
