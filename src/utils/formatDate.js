function parseApiDate(value) {
  if (!value) {
    return null;
  }

  const normalizedValue =
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(value)
      ? `${value}Z`
      : value;

  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = parseApiDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(value) {
  const date = parseApiDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
