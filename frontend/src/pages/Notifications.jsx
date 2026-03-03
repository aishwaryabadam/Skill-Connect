import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getSocket } from '../api/socket';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    api.get('/notifications').then((res) => setNotifications(res.data)).catch(() => []).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
    const socket = getSocket();
    if (socket) {
      socket.emit('join_notifications');
      socket.on('notification', (n) => setNotifications((prev) => [n, ...prev]));
      return () => socket.off('notification');
    }
  }, []);

  const markRead = (id) => {
    api.patch(`/notifications/${id}/read`).then(() => {
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    });
  };

  const markAllRead = () => {
    api.patch('/notifications/read-all').then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button onClick={markAllRead} className="text-primary-600 text-sm font-medium hover:underline">
            Mark all as read
          </button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.length === 0 && (
          <p className="text-gray-500 py-8 text-center">No notifications yet.</p>
        )}
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`card cursor-pointer ${!n.read ? 'bg-primary-50/50 border-l-4 border-primary-500' : ''}`}
            onClick={() => !n.read && markRead(n._id)}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-medium text-gray-900">{n.title}</p>
                {n.body && <p className="text-sm text-gray-600 mt-1">{n.body}</p>}
                <p className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {n.link && (
                <Link to={n.link} className="text-primary-600 text-sm font-medium whitespace-nowrap">
                  View
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
