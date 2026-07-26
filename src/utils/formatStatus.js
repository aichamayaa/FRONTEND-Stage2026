const STATUS_LABELS = Object.freeze({
  Active: 'Active',
  Fermee: 'Fermée',
  Brouillon: 'Brouillon',
  Expiree: 'Expirée',
  Publiee: 'Publiée',
  EnAttente: 'En attente',
  Vue: 'Vue',
  Acceptee: 'Acceptée',
  Refusee: 'Refusée',
  Retiree: 'Retirée',
  Ouverte: 'Ouverte',
  Pourvue: 'Pourvue',
  Annulee: 'Annulée',
  Envoyee: 'Envoyée',
  Accepte: 'Accepté',
  Refuse: 'Refusé',
  Confirme: 'Confirmé',
  Confirmee: 'Confirmée',
  EnCours: 'En cours',
  Termine: 'Terminé',
  Terminee: 'Terminée',
  Annule: 'Annulé'
});

const ROLE_LABELS = Object.freeze({
  SuperAdministrateur: 'Super administrateur',
  Administrateur: 'Administrateur',
  Employeur: 'Employeur',
  Etudiant: 'Étudiant',
  ResponsableStage: 'Responsable de stage'
});

export function formatStatus(value) {
  return STATUS_LABELS[value] ?? value ?? '';
}

export function formatRole(value) {
  return ROLE_LABELS[value] ?? value ?? '';
}
