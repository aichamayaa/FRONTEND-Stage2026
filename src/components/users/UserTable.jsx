import { formatDateTime } from '../../utils/formatDate';
import { formatRole } from '../../utils/formatStatus';
export function UserTable({ users, onEdit, onToggleActif }) {
  if (!users.length) {
    return (
      <div className="empty-state">
        <h2>Aucun utilisateur</h2>
        <p>{"Aucun compte utilisateur n'a encore été créé."}</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>{"Nom d'utilisateur"}</th>
            <th>Courriel</th>
            <th>Rôle</th>
            <th>College</th>
            <th>Statut</th>
            <th>Dernière connexion</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.idUtilisateur}>
              <td>{user.prenom} {user.nom}</td>
              <td>{user.nomUtilisateur}</td>
              <td>{user.courriel}</td>
              <td>{formatRole(user.role)}</td>
              <td>{user.nomCollege ?? user.idCollege ?? '-'}</td>
              <td>
                <span className={user.actif ? 'badge badge-success' : 'badge badge-muted'}>
                  {user.actif ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>
                {user.derniereConnexion
                  ? formatDateTime(user.derniereConnexion)
                  : '-'}
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className="table-action secondary-table-action"
                    type="button"
                    onClick={() => onEdit(user)}
                  >
                    Modifier
                  </button>

                  <button
                    className="table-action"
                    type="button"
                    onClick={() => onToggleActif(user)}
                  >
                    {user.actif ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
