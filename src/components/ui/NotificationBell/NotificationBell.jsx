import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  subscribeToUserNotifications,
  markAsRead,
  markAllAsRead,
} from '../../../services/notificationService';

function timeAgo(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Ahora';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

const TIPO_CONFIG = {
  estado_cambiado: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  nuevo_incidente: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  incidente_estancado: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function NotificationBell() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToUserNotifications(currentUser.uid, setNotifications);
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleNotifClick(notif) {
    await markAsRead(notif.id);
    setOpen(false);
    if (notif.incidenteId) navigate(`/incident/${notif.incidenteId}`);
  }

  async function handleMarkAll() {
    await markAllAsRead(currentUser.uid);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-primary-100 hover:text-white transition-colors p-1"
        aria-label="Notificaciones"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 animate-scale-in">
            <span className="absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-60 animate-ping" style={{ animationDuration: '1.5s' }}></span>
            <span className="relative inline-flex h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full items-center justify-center leading-none">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-slide-down">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Notificaciones</h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-primary-700 hover:text-primary-900 font-medium transition-colors"
              >
                Marcar todo como leído
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400 text-sm">Sin notificaciones nuevas</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = TIPO_CONFIG[notif.tipo] ?? TIPO_CONFIG.estado_cambiado;
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${config.bg} ${config.color}`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">{notif.mensaje}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.fechaCreacion)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
