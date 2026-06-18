import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function LoginForm() {
  const { login } = useAuth();
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await login({ nomUtilisateur, motDePasse });
    } catch {
      setError("Nom d'utilisateur ou mot de passe invalide.");
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        Nom d'utilisateur
        <input value={nomUtilisateur} onChange={(event) => setNomUtilisateur(event.target.value)} />
      </label>

      <label>
        Mot de passe
        <input type="password" value={motDePasse} onChange={(event) => setMotDePasse(event.target.value)} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit">Se connecter</button>
    </form>
  );
}
