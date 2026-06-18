export function formatDate(value) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('fr-CA').format(new Date(value));
}
