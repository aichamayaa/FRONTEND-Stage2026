import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContextDefinition';
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [collegeTheme, setCollegeTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const appliquerThemeUtilisateur = useCallback(async (utilisateur) => {
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
  }, []);

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
  }, [appliquerThemeUtilisateur]);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);

    localStorage.setItem('token', response.token);
    setUser(response.utilisateur);

    await appliquerThemeUtilisateur(response.utilisateur);

    return response;
  }, [appliquerThemeUtilisateur]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setCollegeTheme(null);
      clearCollegeTheme();
    }
  }, []);

  const value = useMemo(() => ({
    user,
    collegeTheme,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout
  }), [user, collegeTheme, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}