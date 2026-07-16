import { createContext, useEffect, useMemo, useState } from 'react';
import {
  applyDefaultCollegeTheme,
  clearCollegeTheme,
  loadAndApplyCollegeTheme
} from '../utils/collegeTheme';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest
} from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [collegeTheme, setCollegeTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  async function appliquerThemeUtilisateur(utilisateur) {
    if (!utilisateur?.idCollege) {
      applyDefaultCollegeTheme();
      setCollegeTheme(null);
      return;
    }

    try {
      const theme = await loadAndApplyCollegeTheme(utilisateur.idCollege);
      setCollegeTheme(theme);
    } catch {
      applyDefaultCollegeTheme();
      setCollegeTheme(null);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      applyDefaultCollegeTheme();
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then(async (utilisateur) => {
        setUser(utilisateur);
        await appliquerThemeUtilisateur(utilisateur);
      })
      .catch(() => {
        localStorage.removeItem('token');
        clearCollegeTheme();
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const response = await loginRequest(credentials);

    localStorage.setItem('token', response.token);
    setUser(response.utilisateur);

    await appliquerThemeUtilisateur(response.utilisateur);

    return response;
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setCollegeTheme(null);
      clearCollegeTheme();
    }
  }

  const value = useMemo(() => ({
    user,
    collegeTheme,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout
  }), [user, collegeTheme, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}