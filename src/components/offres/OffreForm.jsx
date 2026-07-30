import { useState } from 'react';

const TYPE_CONTRAT = ['Temps plein', 'Temps partiel', 'Contractuel', 'Pigiste'];
const TELE_TRAVAIL = ['Aucun', 'Partiel', 'Total'];
const SESSIONS = [
  { value: 'Hiver 2026', label: 'Hiver 2026' },
  { value: 'Ete 2026', label: 'Été 2026' },
  { value: 'Automne 2026', label: 'Automne 2026' },
  { value: 'Hiver 2027', label: 'Hiver 2027' },
  { value: 'Ete 2027', label: 'Été 2027' },
];

const EMPTY_EMPLOI = {
  titre: '',
  description: '',
  ville: '',
  adresse: '',
  dateExpiration: '',
  statut: 'Active',
  typeContrat: '',
  salaireMin: '',
  salaireMax: '',
  teleTravail: '',
  idsDomaines: [],
};

const EMPTY_STAGE = {
  titre: '',
  description: '',
  ville: '',
  adresse: '',
  dateExpiration: '',
  statut: 'Active',
  dateDebutStage: '',
  dateFinStage: '',
  dureeHeuresParSemaine: '',
  remuneration: '',
  session: '',
  idsDomaines: [],
};

function toDateInput(val) {
  if (!val) return '';
  return val.slice(0, 10);
}

export function OffreForm({
  typeOffre,
  initial,
  domaines = [],
  onSubmit,
  onAnnuler,
  isEdit,
  loading,
  error,
}) {
  const defaults =
    typeOffre === 'Stage'
      ? { ...EMPTY_STAGE, ...initial }
      : { ...EMPTY_EMPLOI, ...initial };

  const [form, setForm] = useState({
    ...defaults,
    idsDomaines: defaults.idsDomaines ?? [],
    dateExpiration: toDateInput(defaults.dateExpiration),
    dateDebutStage: toDateInput(defaults.dateDebutStage),
    dateFinStage: toDateInput(defaults.dateFinStage),
  });

  const [domainesOuvert, setDomainesOuvert] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleDomaine(idDomaine) {
    setForm((prev) => {
      const existe = prev.idsDomaines.includes(idDomaine);

      return {
        ...prev,
        idsDomaines: existe
          ? prev.idsDomaines.filter((id) => id !== idDomaine)
          : [...prev.idsDomaines, idDomaine],
      };
    });
  }

  function getDomainesLabel() {
    if (form.idsDomaines.length === 0) {
      return 'Sélectionner un ou plusieurs domaines';
    }

    if (form.idsDomaines.length === 1) {
      const domaine = domaines.find((d) => d.idDomaine === form.idsDomaines[0]);
      return domaine?.nom ?? '1 domaine sélectionné';
    }

    return `${form.idsDomaines.length} domaines sélectionnés`;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      titre: form.titre,
      description: form.description,
      ville: form.ville,
      adresse: form.adresse || undefined,
      dateExpiration: form.dateExpiration || undefined,
      idsDomaines: form.idsDomaines,
      ...(isEdit ? { statut: form.statut } : {}),
    };

    if (typeOffre === 'Stage') {
      payload.dateDebutStage = form.dateDebutStage || undefined;
      payload.dateFinStage = form.dateFinStage || undefined;
      payload.dureeHeuresParSemaine = form.dureeHeuresParSemaine
        ? parseInt(form.dureeHeuresParSemaine, 10)
        : undefined;
      payload.remuneration = form.remuneration
        ? parseFloat(form.remuneration)
        : undefined;
      payload.session = form.session || undefined;
    } else {
      payload.typeContrat = form.typeContrat || undefined;
      payload.salaireMin = form.salaireMin
        ? parseFloat(form.salaireMin)
        : undefined;
      payload.salaireMax = form.salaireMax
        ? parseFloat(form.salaireMax)
        : undefined;
      payload.teleTravail = form.teleTravail || undefined;
    }

    onSubmit(payload);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <h2>
        {isEdit
          ? `Modifier l'offre de ${typeOffre === 'Stage' ? 'stage' : 'emploi'}`
          : `Nouvelle offre de ${typeOffre === 'Stage' ? 'stage' : 'emploi'}`}
      </h2>

      {error && <p className="notice notice-error">{error}</p>}

      <div className="form-grid">
        <label>
          Titre *
          <input
            type="text"
            value={form.titre}
            onChange={(e) => set('titre', e.target.value)}
            required
            maxLength={200}
          />
        </label>

        <label>
          Description *
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            required
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <label>
            Ville *
            <input
              type="text"
              value={form.ville}
              onChange={(e) => set('ville', e.target.value)}
              required
            />
          </label>

          <label>
            Adresse
            <input
              type="text"
              value={form.adresse}
              onChange={(e) => set('adresse', e.target.value)}
            />
          </label>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isEdit ? '1fr 1fr' : '1fr',
            gap: '14px',
          }}
        >
          <label>
            Date d&apos;expiration
            <input
              type="date"
              value={form.dateExpiration}
              onChange={(e) => set('dateExpiration', e.target.value)}
            />
          </label>

          {isEdit && (
            <label>
              Statut
              <select
                value={form.statut}
                onChange={(e) => set('statut', e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Fermee">Fermée</option>
                <option value="Brouillon">Brouillon</option>
              </select>
            </label>
          )}
        </div>

        <div className="domaines-dropdown">
          <span className="domaines-dropdown__title">Domaines d&apos;études</span>

          <button
            type="button"
            className="domaines-dropdown__button"
            onClick={() => setDomainesOuvert((prev) => !prev)}
          >
            <span>{getDomainesLabel()}</span>
            <span aria-hidden="true">▾</span>
          </button>

          {domainesOuvert && (
            <div className="domaines-dropdown__menu">
              {domaines.length === 0 ? (
                <p className="form-help">
                  Aucun domaine disponible pour votre collège.
                </p>
              ) : (
                domaines.map((domaine) => (
                  <label
                    className="domaines-dropdown__item"
                    key={domaine.idDomaine}
                  >
                    <input
                      type="checkbox"
                      checked={form.idsDomaines.includes(domaine.idDomaine)}
                      onChange={() => toggleDomaine(domaine.idDomaine)}
                    />
                    <span>
                      {domaine.nom}
                      {domaine.nomCollege && <small>{domaine.nomCollege}</small>}
                    </span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {typeOffre === 'Emploi' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label>
                Type de contrat
                <select
                  value={form.typeContrat}
                  onChange={(e) => set('typeContrat', e.target.value)}
                >
                  <option value="">-- Choisir --</option>
                  {TYPE_CONTRAT.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Télétravail
                <select
                  value={form.teleTravail}
                  onChange={(e) => set('teleTravail', e.target.value)}
                >
                  <option value="">-- Choisir --</option>
                  {TELE_TRAVAIL.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label>
                Salaire minimum ($/h ou $/an)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.salaireMin}
                  onChange={(e) => set('salaireMin', e.target.value)}
                />
              </label>

              <label>
                Salaire maximum
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.salaireMax}
                  onChange={(e) => set('salaireMax', e.target.value)}
                />
              </label>
            </div>
          </>
        )}

        {typeOffre === 'Stage' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label>
                Session
                <select
                  value={form.session}
                  onChange={(e) => set('session', e.target.value)}
                >
                  <option value="">-- Choisir --</option>
                  {SESSIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Heures / semaine
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={form.dureeHeuresParSemaine}
                  onChange={(e) => set('dureeHeuresParSemaine', e.target.value)}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label>
                Date de début
                <input
                  type="date"
                  value={form.dateDebutStage}
                  onChange={(e) => set('dateDebutStage', e.target.value)}
                />
              </label>

              <label>
                Date de fin
                <input
                  type="date"
                  value={form.dateFinStage}
                  onChange={(e) => set('dateFinStage', e.target.value)}
                />
              </label>
            </div>

            <label>
              Rémunération ($/h)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.remuneration}
                onChange={(e) => set('remuneration', e.target.value)}
              />
            </label>
          </>
        )}
      </div>

      <div className="form-actions" style={{ marginTop: '8px' }}>
        <button
          type="button"
          className="secondary-action"
          onClick={onAnnuler}
          disabled={loading}
        >
          Annuler
        </button>

        <button type="submit" className="primary-action" disabled={loading}>
          {loading ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Publier'}
        </button>
      </div>
    </form>
  );
}