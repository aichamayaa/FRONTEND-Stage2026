import { getCollegeById } from '../services/collegeService';

const DEFAULT_THEME = {
  couleurPrimaire: '#009fda',
  couleurPrimaireFoncee: '#003f7d',
  couleurSecondaire: '#0053a1',
  couleurAccent: '#69be28',
  couleurFond: '#f4f7fb',
  couleurTexte: '#172033',
  logoUrl: '/images/GeraldGodin_Logo_COULEUR@2x.png'
};

function setCssVariable(name, value) {
  if (!value) {
    return;
  }

  document.documentElement.style.setProperty(name, value);
}

export function applyCollegeTheme(college) {
  const theme = {
    ...DEFAULT_THEME,
    ...college
  };

  setCssVariable('--color-primary', theme.couleurPrimaire);
  setCssVariable('--color-primary-dark', theme.couleurPrimaireFoncee);
  setCssVariable('--color-primary-hover', theme.couleurPrimaire);
  setCssVariable('--color-secondary', theme.couleurSecondaire);
  setCssVariable('--color-accent', theme.couleurAccent);
  setCssVariable('--color-bg', theme.couleurFond);
  setCssVariable('--color-text', theme.couleurTexte);

  localStorage.setItem('collegeTheme', JSON.stringify(theme));
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