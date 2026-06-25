import { useState } from 'react';

const TYPE_CONTRAT = ['Temps plein', 'Temps partiel', 'Contractuel', 'Pigiste'];
const TELE_TRAVAIL = ['Aucun', 'Partiel', 'Total'];
const SESSIONS = ['Hiver 2026', 'Ete 2026', 'Automne 2026', 'Hiver 2027', 'Ete 2027'];

// Valeurs initiales vides pour un formulaire vide
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

export function OffreForm({ typeOffre, initial, onSubmit, onAnnuler, isEdit, loading, error }) {
  const defaults = typeOffre === 'Stage'
    ? { ...EMPTY_STAGE, ...initial }
    : { ...EMPTY_EMPLOI, ...initial };

  const [form, setForm] = useState({
    ...defaults,
    dateExpiration: toDateInput(defaults.dateExpiration),
    dateDebutStage: toDateInput(defaults.dateDebutStage),
    dateFinStage: toDateInput(defaults.dateFinStage),
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
        ? parseInt(form.dureeHeuresParSemaine)
        : undefined;
      payload.remuneration = form.remuneration
        ? parseFloat(form.remuneration)
        : undefined;
      payload.session = form.session || undefined;
    } else {
      payload.typeContrat = form.typeContrat || undefined;
      payload.salaireMin = form.salaireMin ? parseFloat(form.salaireMin) : undefined;
      payload.salaireMax = form.salaireMax ? parseFloat(form.salaireMax) : undefined;
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
            style={{ padding: '8px 10px', border: '1px solid #b7d8ec', borderRadius: '6px', resize: 'vertical' }}
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

        <div style={{ display: 'grid', gridTemplateColumns: isEdit ? '1fr 1fr' : '1fr', gap: '14px' }}>
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
                <option value="Fermee">Fermee</option>
                <option value="Brouillon">Brouillon</option>
              </select>
            </label>
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
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Teletravail
                <select
                  value={form.teleTravail}
                  onChange={(e) => set('teleTravail', e.target.value)}
                >
                  <option value="">-- Choisir --</option>
                  {TELE_TRAVAIL.map((t) => (
                    <option key={t} value={t}>{t}</option>
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
                    <option key={s} value={s}>{s}</option>
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
                Date de debut
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
              Remuneration ($/h)
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
        <button
          type="submit"
          className="primary-action"
          disabled={loading}
        >
          {loading
            ? 'Enregistrement...'
            : isEdit
              ? 'Enregistrer'
              : 'Publier'}
        </button>
      </div>
    </form>
  );
}
