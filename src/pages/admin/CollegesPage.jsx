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
  actif: true,
  couleurPrimaire: '#009fda',
  couleurPrimaireFoncee: '#003f7d',
  couleurSecondaire: '#0053a1',
  couleurAccent: '#69be28',
  couleurFond: '#f4f7fb',
  couleurTexte: '#172033',
  logoUrl: ''
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
      setError(getErrorMessage(e) || 'Impossible de charger les cegeps.');
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
      actif: college.actif ?? true,
      couleurPrimaire: college.couleurPrimaire ?? '#009fda',
      couleurPrimaireFoncee: college.couleurPrimaireFoncee ?? '#003f7d',
      couleurSecondaire: college.couleurSecondaire ?? '#0053a1',
      couleurAccent: college.couleurAccent ?? '#69be28',
      couleurFond: college.couleurFond ?? '#f4f7fb',
      couleurTexte: college.couleurTexte ?? '#172033',
      logoUrl: college.logoUrl ?? ''
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
      actif: form.actif,
      couleurPrimaire: form.couleurPrimaire,
      couleurPrimaireFoncee: form.couleurPrimaireFoncee,
      couleurSecondaire: form.couleurSecondaire,
      couleurAccent: form.couleurAccent,
      couleurFond: form.couleurFond,
      couleurTexte: form.couleurTexte,
      logoUrl: form.logoUrl.trim() || null
    };

    if (!payload.nom || !payload.ville) {
      setError('Le nom et la ville du cegep sont obligatoires.');
      setSaving(false);
      return;
    }

    try {
      if (selectedCollege) {
        await updateCollege(selectedCollege.idCollege, payload);
        setMessage('Cegep modifie avec succes.');
      } else {
        await createCollege(payload);
        setMessage('Cegep cree avec succes.');
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
      `Desactiver le cegep "${college.nom}" ?`
    );

    if (!confirmation) return;

    setMessage('');
    setError('');

    try {
      await deleteCollege(college.idCollege);
      setMessage('Cegep desactive avec succes.');
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
          <h1>Gestion des cegeps</h1>
          <p>
            Creez, modifiez et personnalisez les cegeps participants de la plateforme.
          </p>
        </div>
      </section>

      {message && <p className="notice notice-success">{message}</p>}
      {error && <p className="notice notice-error">{error}</p>}

      <section className="admin-grid">
        <div className="panel">
          <h2>
            {selectedCollege ? 'Modifier un cegep' : 'Creer un cegep'}
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
                  placeholder="Ex. Cegep Gerald-Godin"
                />
              </label>

              <label>
                Ville
                <input
                  type="text"
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  placeholder="Ex. Montreal"
                />
              </label>

              <label>
                Logo URL
                <input
                  type="text"
                  name="logoUrl"
                  value={form.logoUrl}
                  onChange={handleChange}
                  placeholder="/images/logo-college.png"
                />
              </label>

              <div className="theme-form-grid">
                <label>
                  Primaire
                  <input
                    type="color"
                    name="couleurPrimaire"
                    value={form.couleurPrimaire}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Primaire foncee
                  <input
                    type="color"
                    name="couleurPrimaireFoncee"
                    value={form.couleurPrimaireFoncee}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Secondaire
                  <input
                    type="color"
                    name="couleurSecondaire"
                    value={form.couleurSecondaire}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Accent
                  <input
                    type="color"
                    name="couleurAccent"
                    value={form.couleurAccent}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Fond
                  <input
                    type="color"
                    name="couleurFond"
                    value={form.couleurFond}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Texte
                  <input
                    type="color"
                    name="couleurTexte"
                    value={form.couleurTexte}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div
                className="theme-preview"
                style={{
                  '--preview-primary': form.couleurPrimaire,
                  '--preview-dark': form.couleurPrimaireFoncee,
                  '--preview-secondary': form.couleurSecondaire,
                  '--preview-accent': form.couleurAccent,
                  '--preview-bg': form.couleurFond,
                  '--preview-text': form.couleurTexte
                }}
              >
                <div>
                  <strong>Apercu du theme</strong>
                  <span>{form.nom || 'Nom du cegep'}</span>
                </div>
                <button type="button">Action</button>
              </div>

              <label>
                <span>
                  <input
                    type="checkbox"
                    name="actif"
                    checked={form.actif}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  Cegep actif
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-action" disabled={saving}>
                {saving
                  ? 'Enregistrement...'
                  : selectedCollege
                    ? 'Modifier'
                    : 'Creer'}
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
          <h2>Cegeps</h2>

          {loading ? (
            <p>Chargement...</p>
          ) : colleges.length === 0 ? (
            <div className="empty-state">
              <p>Aucun cegep trouve.</p>
            </div>
          ) : (
            <div className="table-shell">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Ville</th>
                    <th>Theme</th>
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
                        <div className="theme-swatches">
                          <span style={{ background: college.couleurPrimaire }} />
                          <span style={{ background: college.couleurSecondaire }} />
                          <span style={{ background: college.couleurAccent }} />
                        </div>
                      </td>
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
                            Desactiver
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
