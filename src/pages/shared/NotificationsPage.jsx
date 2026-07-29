import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { getMesNotifications, marquerLue } from '../../services/notificationService';
import { formatDateTime } from '../../utils/formatDate';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  async function charger() {
    setChargement(true);
    try {
      const data = await getMesNotifications();
      setNotifications(data);
      setErreur(null);
    } catch {
      setErreur('Impossible de charger les notifications.');
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  async function handleLue(id) {
    try {
      await marquerLue(id);
      charger();
    } catch {
      setErreur('Impossible de marquer la notification.');
    }
  }

  async function handleVoir(n) {
    try {
      if (!n.lue) {
        await marquerLue(n.idNotification);
      }
    } catch {
      /* on redirige quand meme */
    }
    if (n.lien) {
      navigate(n.lien);
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <p className="page-kicker">Notifications</p>
        <h1>Mes notifications</h1>
        <p>Les événements liés à vos offres et candidatures.</p>
      </div>

      {erreur && <p className="notice notice-error">{erreur}</p>}
      {chargement && <p>Chargement...</p>}

      {!chargement && notifications.length === 0 && (
        <div className="empty-state">
          <h2>Aucune notification</h2>
          <p>Vous n’avez aucune notification pour le moment.</p>
        </div>
      )}

      {!chargement && notifications.length > 0 && (
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.idNotification}>
                  <td>{n.message}</td>
                  <td>{formatDateTime(n.dateCreation)}</td>
                  <td>
                    <span className={`badge ${n.lue ? 'badge-muted' : 'badge-success'}`}>
                      {n.lue ? 'Lue' : 'Nouvelle'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {n.lien && (
                        <button
                          type="button"
                          className="table-action"
                          onClick={() => handleVoir(n)}
                        >
                          Voir
                        </button>
                      )}
                      {!n.lue ? (
                        <button
                          type="button"
                          className="table-action secondary-table-action"
                          onClick={() => handleLue(n.idNotification)}
                        >
                          Marquer comme lue
                        </button>
                      ) : (
                        !n.lien && <span>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
