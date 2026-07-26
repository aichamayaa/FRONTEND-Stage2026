import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { UserForm } from '../../components/users/UserForm';
import { UserTable } from '../../components/users/UserTable';
import { useAuth } from '../../hooks/useAuth';
import { getRoles } from '../../services/roleService';
import {
  activerUser,
  createUser,
  desactiverUser,
  getUsers,
  updateUser
} from '../../services/userService';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [usersData, rolesData] = await Promise.all([
        getUsers(),
        getRoles()
      ]);

      setUsers(usersData);
      setRoles(rolesData);
    } catch {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateUser(user) {
    setMessage('');
    setError('');

    try {
      await createUser(user);
      setMessage('Utilisateur créé avec succès.');
      await loadData();
    } catch {
      setError("Impossible de créer l'utilisateur.");
    }
  }

  async function handleUpdateUser(user) {
    setMessage('');
    setError('');

    try {
      await updateUser(selectedUser.idUtilisateur, user);
      setSelectedUser(null);
      setMessage('Utilisateur modifié avec succès.');
      await loadData();
    } catch {
      setError("Impossible de modifier l'utilisateur.");
    }
  }

  function handleSubmitUser(user) {
    if (selectedUser) {
      return handleUpdateUser(user);
    }

    return handleCreateUser(user);
  }

  async function handleToggleActif(user) {
    setMessage('');
    setError('');

    try {
      if (user.actif) {
        await desactiverUser(user.idUtilisateur);
        setMessage('Utilisateur désactivé.');
      } else {
        await activerUser(user.idUtilisateur);
        setMessage('Utilisateur active.');
      }

      await loadData();
    } catch {
      setError("Impossible de modifier le statut de l'utilisateur.");
    }
  }

  return (
    <AppLayout>
      <section className="page-header">
        <div>
          <p className="page-kicker">Administration</p>
          <h1>Gestion des utilisateurs</h1>
          <p>
            Créez les comptes et gérez les accès selon votre niveau
            {"d'administration."}
          </p>
        </div>
      </section>

      {message && <p className="notice notice-success">{message}</p>}
      {error && <p className="notice notice-error">{error}</p>}

      <section className="admin-grid">
        <div className="panel">
          <h2>{selectedUser ? 'Modifier un utilisateur' : 'Créer un utilisateur'}</h2>
          <UserForm
            roles={roles}
            currentUser={currentUser}
            userToEdit={selectedUser}
            onSubmit={handleSubmitUser}
            onCancelEdit={() => setSelectedUser(null)}
          />
        </div>

        <div className="panel admin-list-panel">
          <h2>Utilisateurs</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <UserTable
              users={users}
              onEdit={setSelectedUser}
              onToggleActif={handleToggleActif}
            />
          )}
        </div>
      </section>
    </AppLayout>
  );
}
