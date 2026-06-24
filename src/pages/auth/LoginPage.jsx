import { Navigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated } = useAuth();

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
          <h2>Connecter les étudiants, les employeurs et les stages.</h2>
          <p>
            Une plateforme institutionnelle pour gérer les candidatures,
            les offres et le suivi de placement.
          </p>
        </div>
      </section>

      <section className="login-panel">
        <p className="login-eyebrow">Accès sécurisé</p>
        <h2>Connexion</h2>
        <LoginForm />
      </section>
    </main>
  );
}