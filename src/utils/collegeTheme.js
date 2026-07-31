import { getCollegeById } from '../services/collegeService';

const APPEARANCE_STORAGE_KEY = 'application-theme';

const DEFAULT_THEME = {
  couleurPrimaire: '#009fda',
  couleurPrimaireFoncee: '#003f7d',
  couleurSecondaire: '#0053a1',
  couleurAccent: '#69be28',
  couleurFond: '#f4f7fb',
  couleurTexte: '#172033',
  logoUrl: '/images/GeraldGodin_Logo_COULEUR@2x.png'
};

const DARK_THEME = {
  primary: '#38bdf8',
  primaryDark: '#b9e6ff',
  primaryHover: '#1698cc',
  secondary: '#438bd3',
  accent: '#85d442',
  background: '#0b1220',
  surface: '#151f31',
  surfaceSoft: '#101b2c',
  surfaceRaised: '#1c3048',
  border: '#35445b',
  text: '#f1f5f9',
  muted: '#aab7c8',
  danger: '#ffb4ad',
  inputBackground: '#0e1929',
  inputBorder: '#465a75'
};

function setCssVariable(name, value) {
  if (!value) {
    return;
  }

  document.documentElement.style.setProperty(name, value);
}

function getAppearanceTheme() {
  return localStorage.getItem(APPEARANCE_STORAGE_KEY) === 'dark'
    ? 'dark'
    : 'light';
}

function applyResolvedTheme(collegeTheme) {
  const appearance = getAppearanceTheme();
  const isDarkMode = appearance === 'dark';

  const resolvedTheme = isDarkMode
    ? DARK_THEME
    : {
        primary: collegeTheme.couleurPrimaire,
        primaryDark: collegeTheme.couleurPrimaireFoncee,
        primaryHover: collegeTheme.couleurPrimaire,
        secondary: collegeTheme.couleurSecondaire,
        accent: collegeTheme.couleurAccent,
        background: collegeTheme.couleurFond,
        surface: '#ffffff',
        surfaceSoft: '#f7fbff',
        surfaceRaised: '#e8f6fc',
        border: '#d9e2ec',
        text: collegeTheme.couleurTexte,
        muted: '#65758b',
        danger: '#b42318',
        inputBackground: '#f7fbff',
        inputBorder: '#b7d8ec'
      };

  document.documentElement.dataset.theme = appearance;

  setCssVariable('--color-primary', resolvedTheme.primary);
  setCssVariable('--color-primary-dark', resolvedTheme.primaryDark);
  setCssVariable('--color-primary-hover', resolvedTheme.primaryHover);
  setCssVariable('--color-secondary', resolvedTheme.secondary);
  setCssVariable('--color-accent', resolvedTheme.accent);

  setCssVariable('--color-bg', resolvedTheme.background);
  setCssVariable('--color-surface', resolvedTheme.surface);
  setCssVariable('--color-surface-soft', resolvedTheme.surfaceSoft);
  setCssVariable('--color-surface-raised', resolvedTheme.surfaceRaised);
  setCssVariable('--color-border', resolvedTheme.border);

  setCssVariable('--color-text', resolvedTheme.text);
  setCssVariable('--color-muted', resolvedTheme.muted);
  setCssVariable('--color-danger', resolvedTheme.danger);

  setCssVariable('--color-input-bg', resolvedTheme.inputBackground);
  setCssVariable('--color-input-border', resolvedTheme.inputBorder);
}

export function applyAppearanceTheme(appearance) {
  const normalizedAppearance =
    appearance === 'dark' ? 'dark' : 'light';

  localStorage.setItem(
    APPEARANCE_STORAGE_KEY,
    normalizedAppearance
  );

  document.documentElement.dataset.theme =
    normalizedAppearance;

  applyResolvedTheme(getStoredCollegeTheme());
}

export function applyCollegeTheme(college) {
  const theme = {
    ...DEFAULT_THEME,
    ...college
  };

  localStorage.setItem(
    'collegeTheme',
    JSON.stringify(theme)
  );

  applyResolvedTheme(theme);
}

export function applyDefaultCollegeTheme() {
  applyCollegeTheme(DEFAULT_THEME);
}

export function getStoredCollegeTheme() {
  const storedTheme = localStorage.getItem('collegeTheme');

  if (!storedTheme) {
    return DEFAULT_THEME;
  }

  try {
    return {
      ...DEFAULT_THEME,
      ...JSON.parse(storedTheme)
    };
  } catch {
    return DEFAULT_THEME;
  }
}

export async function loadAndApplyCollegeTheme(idCollege) {
  if (!idCollege) {
    applyDefaultCollegeTheme();
    return DEFAULT_THEME;
  }

  const college = await getCollegeById(idCollege);
  applyCollegeTheme(college);

  return {
    ...DEFAULT_THEME,
    ...college
  };
}

export function clearCollegeTheme() {
  localStorage.removeItem('collegeTheme');
  applyDefaultCollegeTheme();
}
