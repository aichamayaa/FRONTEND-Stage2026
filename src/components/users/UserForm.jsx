import { useEffect, useMemo, useState } from 'react';
import { formatRole } from '../../utils/formatStatus';

const createInitialState = {
  prenom: '',
  nom: '',
  courriel: '',
  nomUtilisateur: '',
  motDePasse: '',
  langue: 'fr',
  idRole: 2,
  idCollege: ''
};

function buildEditState(user) {
  return {
    prenom: user.prenom ?? '',
    nom: user.nom ?? '',
    courriel: user.courriel ?? '',
    nomUtilisateur: user.nomUtilisateur ?? '',
    motDePasse: '',
    langue: user.langue ?? 'fr',
    idRole: user.idRole ?? 2,
    idCollege: user.idCollege ?? '',
    actif: user.actif ?? true
  };
}

export function UserForm({ roles, currentUser, userToEdit, onSubmit, onCancelEdit }) {
  const isEditMode = Boolean(userToEdit);
  const [form, setForm] = useState(createInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSuperAdmin = currentUser?.role === 'SuperAdministrateur';

  const availableRoles = useMemo(() => {
    if (isSuperAdmin) {
      return roles;
    }

    // Un admin local ne peut pas creer ou attribuer le role SuperAdministrateur.
    return roles.filter((role) => role.nomRole !== 'SuperAdministrateur');
  }, [roles, isSuperAdmin]);

  useEffect(() => {
    if (userToEdit) {
      setForm(buildEditState(userToEdit));
      return;
    }

    setForm(createInitialState);
  }, [userToEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === 'idRole' ? Number(value) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const basePayload = {
      prenom: form.prenom,
      nom: form.nom,
      courriel: form.courriel,
      langue: form.langue,
      idRole: Number(form.idRole),
      idCollege: form.idCollege === '' ? null : Number(form.idCollege)
    };

    const payload = isEditMode
      ? {
          ...basePayload,
          actif: Boolean(form.actif)
        }
      : {
          ...basePayload,
          nomUtilisateur: form.nomUtilisateur,
          motDePasse: form.motDePasse
        };

    try {
      await onSubmit(payload);
      setForm(createInitialState);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Prénom
          <input
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nom
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Courriel
          <input
            type="email"
            name="courriel"
            value={form.courriel}
            onChange={handleChange}
            required
          />
        </label>

        {!isEditMode && (
          <label>
            {"Nom d'utilisateur"}
            <input
              name="nomUtilisateur"
              value={form.nomUtilisateur}
              onChange={handleChange}
              required
            />
          </label>
        )}

        {!isEditMode && (
          <label>
            Mot de passe
            <input
              type="password"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              required
            />
          </label>
        )}

        <label>
          Rôle
          <select
            name="idRole"
            value={form.idRole}
            onChange={handleChange}
            required
          >
            {availableRoles.map((role) => (
              <option key={role.idRole} value={role.idRole}>
                {formatRole(role.nomRole)}
              </option>
            ))}
          </select>
        </label>

        {isSuperAdmin && (
          <label>
            ID du collège
            <input
              type="number"
              min="1"
              name="idCollege"
              value={form.idCollege}
              onChange={handleChange}
              placeholder="Laisser vide pour le super administrateur"
            />
          </label>
        )}
      </div>

      {!isSuperAdmin && (
        <p className="form-help">
          Votre compte administrateur rattache automatiquement les utilisateurs
          à votre collège.
        </p>
      )}

      <div className="form-actions">
        <button className="primary-action" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Enregistrement...'
            : isEditMode
              ? 'Enregistrer les modifications'
              : "Créer l'utilisateur"}
        </button>

        {isEditMode && (
          <button
            className="secondary-action"
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
