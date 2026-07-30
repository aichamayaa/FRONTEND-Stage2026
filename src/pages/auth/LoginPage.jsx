import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    () => document.documentElement.dataset.theme === 'dark'
  );

  function toggleTheme() {
    const nextTheme = isDarkMode ? 'light' : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('application-theme', nextTheme);
    setIsDarkMode(nextTheme === 'dark');
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-brand">
          <img
            className="login-logo"
            src="/images/GeraldGodin_Logo_COULEUR@2x.png"
            alt="Cégep Gérald-Godin"
          />

          <div>
            <p className="login-eyebrow">Cégep Gérald-Godin</p>
            <h1>Placement en ligne</h1>
          </div>
        </div>

        <div className="login-hero-text">
          <h2
            style={{
              fontSize: 'clamp(1.95rem, 2.35vw, 2.5rem)',
              lineHeight: 1.1,
              maxWidth: '720px',
              width: '100%',
            }}
          >
            Votre espace de placement,
            <br />
            au cœur de votre cégep.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.1vw, 1.1rem)',
              lineHeight: 1.5,
              maxWidth: '760px',
              width: '100%',
            }}
          >
            Offres, candidatures, stages, emplois et suivi réunis au même endroit.
          </p>
        </div>
      </section>

      <section className="login-panel">
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={isDarkMode}
          onClick={toggleTheme}
        >
          {isDarkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </button>
        <p className="login-eyebrow">Accès sécurisé</p>
        <h2>Connexion</h2>
        <LoginForm />
      </section>
    </main>
  );
}