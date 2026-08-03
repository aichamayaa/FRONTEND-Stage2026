import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { getColleges } from '../../services/collegeService';
import {
  ajouterCollegeAuDomaine,
  createDomaineEtude,
  deleteDomaineEtude,
  getDomainesEtudes,
  updateDomaineEtude
} from '../../services/domaineEtudeService';

const initialForm = {
  nom: '',
  code: '',
  actif: true,
  accepteStagiaires: true,
  idsColleges: []
};

const initialCollegeLinkForm = {
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
  const { user } = useAuth();

  const [domaines, setDomaines] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [collegeLinkForm, setCollegeLinkForm] = useState(initialCollegeLinkForm);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linkSaving, setLinkSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isSuperAdmin = user?.role === 'SuperAdministrateur';
  const isAdmin = user?.role === 'Administrateur';

  const collegesActifs = useMemo(
    () => colleges.filter((college) => college.actif !== false),
    [colleges]
  );

  const collegesDisponiblesPourAjout = useMemo(() => {
    if (!selectedDomaine) return [];

    const idsDejaLies = selectedDomaine.colleges?.map((college) => college.idCollege) ?? [];

    return collegesActifs.filter(
      (college) => !idsDejaLies.includes(college.idCollege)
    );
  }, [collegesActifs, selectedDomaine]);

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

      return domainesData;
    } catch (e) {
      setError(getErrorMessage(e) || 'Impossible de charger les données.');
      return [];
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

  function handleCollegeLinkChange(event) {
    const { name, value, type, checked } = event.target;

    setCollegeLinkForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleCollegeToggle(idCollege) {
    setForm((prev) => {
      const existe = prev.idsColleges.includes(idCollege);

      return {
        ...prev,
        idsColleges: existe
          ? prev.idsColleges.filter((id) => id !== idCollege)
          : [...prev.idsColleges, idCollege]
      };
    });
  }

  function handleEdit(domaine) {
    setSelectedDomaine(domaine);

    setForm({
      nom: domaine.nom ?? '',
      code: domaine.code ?? '',
      actif: domaine.actif ?? true,
      accepteStagiaires: domaine.accepteStagiaires ?? true,
      idsColleges: domaine.colleges?.map((college) => college.idCollege) ?? []
    });

    setCollegeLinkForm(initialCollegeLinkForm);
    setMessage('');
    setError('');
  }

  function handleCancelEdit() {
    setSelectedDomaine(null);
    setForm(initialForm);
    setCollegeLinkForm(initialCollegeLinkForm);
    setMessage('');
    setError('');
  }

  function buildCreatePayload() {
    const collegesPayload = isSuperAdmin
      ? form.idsColleges.map((idCollege) => ({
          idCollege,
          accepteStagiaires: form.accepteStagiaires,
          actif: true
        }))
      : [];

    return {
      nom: form.nom.trim(),
      code: form.code.trim(),
      actif: form.actif,
      colleges: collegesPayload
    };
  }

  function buildUpdatePayload() {
    return {
      nom: form.nom.trim(),
      code: form.code.trim(),
      actif: form.actif
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    const nom = form.nom.trim();
    const code = form.code.trim();

    if (!nom || !code) {
      setError('Le nom et le code sont obligatoires.');
      setSaving(false);
      return;
    }

    if (!selectedDomaine && isSuperAdmin && form.idsColleges.length === 0) {
      setError('Sélectionnez au moins un cégep.');
      setSaving(false);
      return;
    }

    try {
      if (selectedDomaine) {
        await updateDomaineEtude(selectedDomaine.idDomaine, buildUpdatePayload());
        setMessage('Domaine d’études modifié avec succès.');
      } else {
        await createDomaineEtude(buildCreatePayload());
        setMessage('Domaine d’études créé avec succès.');
      }

      setSelectedDomaine(null);
      setForm(initialForm);
      setCollegeLinkForm(initialCollegeLinkForm);
      await loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleAddCollegeToDomaine(event) {
    event.preventDefault();

    if (!selectedDomaine) return;

    const idCollege = Number(collegeLinkForm.idCollege);

    if (!idCollege) {
      setError('Sélectionnez un cégep à ajouter.');
      return;
    }

    setLinkSaving(true);
    setMessage('');
    setError('');

    try {
      await ajouterCollegeAuDomaine(selectedDomaine.idDomaine, idCollege, {
        accepteStagiaires: collegeLinkForm.accepteStagiaires,
        actif: collegeLinkForm.actif
      });

      const domainesData = await loadData();
      const domaineMisAJour = domainesData.find(
        (domaine) => domaine.idDomaine === selectedDomaine.idDomaine
      );

      if (domaineMisAJour) {
        setSelectedDomaine(domaineMisAJour);
        setForm((prev) => ({
          ...prev,
          idsColleges: domaineMisAJour.colleges?.map((college) => college.idCollege) ?? []
        }));
      }

      setCollegeLinkForm(initialCollegeLinkForm);
      setMessage('Cégep ajouté au domaine avec succès.');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLinkSaving(false);
    }
  }

  async function handleDelete(domaine) {
    const confirmation = window.confirm(
      `Désactiver le domaine "${domaine.nom}" ?`
    );

    if (!confirmation) return;

    setMessage('');
    setError('');

    try {
      await deleteDomaineEtude(domaine.idDomaine);
      setMessage('Domaine d’études désactivé avec succès.');
      await loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  function renderColleges(domaine) {
    const liens = domaine.colleges ?? [];

    if (liens.length === 0) {
      return <span className="text-muted">Aucun cégep lié</span>;
    }

    return (
      <div className="stacked-list">
        {liens.map((college) => (
          <span key={college.idCollege}>
            {college.nomCollege}
            {college.actif === false ? ' (inactif)' : ''}
          </span>
        ))}
      </div>
    );
  }

  function renderStagiaires(domaine) {
    const liens = domaine.colleges ?? [];

    if (liens.length === 0) {
      return <span className="badge badge-muted">Non défini</span>;
    }

    const accepte = liens.some((college) => college.accepteStagiaires);

    return (
      <span className={accepte ? 'badge badge-success' : 'badge badge-muted'}>
        {accepte ? 'Oui' : 'Non'}
      </span>
    );
  }

  return (
    <AppLayout>
      <section className="page-header">
        <div>
          <p className="page-kicker">Administration</p>
          <h1>Gestion des domaines d’études</h1>
          <p>
            Créez des domaines globaux et associez-les aux cégeps de la plateforme.
          </p>
        </div>
      </section>

      {message && <p className="notice notice-success">{message}</p>}
      {error && <p className="notice notice-error">{error}</p>}

      <section className="admin-grid">
        <div className="panel">
          <h2>
            {selectedDomaine
              ? 'Modifier un domaine d’études'
              : 'Créer un domaine d’études'}
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

              {isSuperAdmin && !selectedDomaine && (
                <div className="form-field-full">
                  <p className="field-label">Cégeps liés</p>

                  <div className="checkbox-list">
                    {collegesActifs.map((college) => (
                      <label className="checkbox-row" key={college.idCollege}>
                        <input
                          type="checkbox"
                          checked={form.idsColleges.includes(college.idCollege)}
                          onChange={() => handleCollegeToggle(college.idCollege)}
                        />
                        <span>{college.nom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {isAdmin && !selectedDomaine && (
                <p className="form-help">
                  Le domaine sera automatiquement lié à votre cégep.
                </p>
              )}

              {!selectedDomaine && (
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
              )}

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
                    : 'Créer'}
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

          {isSuperAdmin && selectedDomaine && (
            <form onSubmit={handleAddCollegeToDomaine} className="admin-form" style={{ marginTop: '24px' }}>
              <h3>Ajouter un cégep à ce domaine</h3>

              {collegesDisponiblesPourAjout.length === 0 ? (
                <p className="form-help">
                  Tous les cégeps actifs sont déjà liés à ce domaine.
                </p>
              ) : (
                <>
                  <div className="form-grid">
                    <label>
                      Cégep à ajouter
                      <select
                        name="idCollege"
                        value={collegeLinkForm.idCollege}
                        onChange={handleCollegeLinkChange}
                      >
                        <option value="">Sélectionner un cégep</option>
                        {collegesDisponiblesPourAjout.map((college) => (
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
                          checked={collegeLinkForm.accepteStagiaires}
                          onChange={handleCollegeLinkChange}
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
                          checked={collegeLinkForm.actif}
                          onChange={handleCollegeLinkChange}
                          style={{ marginRight: '8px' }}
                        />
                        Lien actif
                      </span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="primary-action" disabled={linkSaving}>
                      {linkSaving ? 'Ajout...' : 'Ajouter ce cégep'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        <div className="panel admin-list-panel">
          <h2>Domaines d’études</h2>

          {loading ? (
            <p>Chargement...</p>
          ) : domaines.length === 0 ? (
            <div className="empty-state">
              <p>Aucun domaine d’études trouvé.</p>
            </div>
          ) : (
            <div className="table-shell">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Code</th>
                    <th>Cégeps</th>
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
                      <td>{renderColleges(domaine)}</td>
                      <td>{renderStagiaires(domaine)}</td>
                      <td>
                        <span className={domaine.actif ? 'badge badge-success' : 'badge badge-muted'}>
                          {domaine.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {isSuperAdmin && (
                            <button
                              type="button"
                              className="secondary-action"
                              onClick={() => handleEdit(domaine)}
                            >
                              Modifier
                            </button>
                          )}

                          <button
                            type="button"
                            className="danger-action"
                            onClick={() => handleDelete(domaine)}
                          >
                            Désactiver
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