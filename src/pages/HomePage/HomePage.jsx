import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getIncidents, getUserIncidents } from '../../services/incidentService';
import IncidentCard from '../../components/incidents/IncidentCard/IncidentCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Alert from '../../components/ui/Alert/Alert';

export default function HomePage() {
  const { currentUser, userProfile } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = userProfile?.rol === 'admin';

  useEffect(() => {
    async function loadIncidents() {
      try {
        let data;
        if (isAdmin) {
          data = await getIncidents();
        } else {
          data = await getUserIncidents(currentUser.uid);
        }
        setIncidents(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los incidentes.');
      } finally {
        setLoading(false);
      }
    }
    loadIncidents();
  }, [currentUser, isAdmin]);

  const total = incidents.length;
  const reportados = incidents.filter((i) => i.estado === 'Reportado').length;
  const enProceso = incidents.filter((i) => i.estado === 'En proceso').length;
  const resueltos = incidents.filter((i) => i.estado === 'Resuelto').length;
  const recent = incidents.slice(0, 5);

  const summaryCards = [
    {
      label: 'Total',
      value: total,
      color: 'bg-primary-50 border-primary-200',
      textColor: 'text-primary-700',
      icon: (
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Reportados',
      value: reportados,
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    {
      label: 'En Proceso',
      value: enProceso,
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Resueltos',
      value: resueltos,
      color: 'bg-primary-50 border-primary-200',
      textColor: 'text-primary-700',
      icon: (
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {userProfile?.nombre || currentUser?.email}
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdmin
              ? 'Panel de administración'
              : 'Gestiona y sigue tus reportes de incidentes.'}
          </p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center space-x-2 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors bg-primary-700 hover:bg-primary-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Reportar Incidente</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={"border rounded-xl p-5 " + card.color + " flex items-center space-x-4"}
          >
            <div className="flex-shrink-0">{card.icon}</div>
            <div>
              <p className={"text-2xl font-bold " + card.textColor}>{card.value}</p>
              <p className="text-sm text-gray-600">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Incidentes Recientes</h2>
          <Link
            to={isAdmin ? '/admin' : '/my-incidents'}
            className="text-primary-700 hover:text-primary-900 text-sm font-medium transition-colors"
          >
            Ver todos
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Cargando incidentes..." />
        ) : recent.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm mb-4">No hay incidentes reportados aun.</p>
            <Link
              to="/report"
              className="inline-block text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-primary-700 hover:bg-primary-800"
            >
              Reportar primer incidente
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
