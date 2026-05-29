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

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

  const summaryCards = [
    {
      label: 'Total',
      value: total,
      cardClass: 'bg-white border-gray-200',
      textClass: 'text-primary-600',
      icon: (
        <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Reportados',
      value: reportados,
      cardClass: 'bg-white border-gray-200',
      textClass: 'text-red-500',
      icon: (
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    {
      label: 'En Proceso',
      value: enProceso,
      cardClass: 'bg-white border-gray-200',
      textClass: 'text-yellow-600',
      icon: (
        <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Resueltos',
      value: resueltos,
      cardClass: 'bg-white border-gray-200',
      textClass: 'text-primary-600',
      icon: (
        <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="rounded-2xl bg-primary-700 overflow-hidden flex mb-8 min-h-[180px] animate-fade-in-up">
        <div className="flex-1 p-8 flex flex-col justify-center">
          <p className="text-primary-200 text-sm mb-1">{today}</p>
          <h1 className="text-3xl font-extrabold text-white mb-1">
            ¡Hola, {userProfile?.nombre?.split(' ')[0] || currentUser?.email}!
          </h1>
          <p className="text-primary-200 text-sm mb-6">
            {isAdmin ? 'Panel de administración.' : 'Consulta tus reportes o crea uno nuevo.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Reportar incidente
            </Link>
            <Link
              to={isAdmin ? '/admin' : '/my-incidents'}
              className="inline-flex items-center gap-2 bg-primary-800 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors"
            >
              Ver todos
            </Link>
          </div>
        </div>

        <div className="hidden sm:flex w-[480px] xl:w-[560px] flex-shrink-0 items-center justify-center bg-primary-800 rounded-r-2xl overflow-hidden">
          <img
            src="/Icons/logocentral.jpg"
            alt="Universidad de la Amazonia"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <div
            key={card.label}
            className={`rounded-xl p-5 flex items-center gap-4 border animate-fade-in-up ${card.cardClass}`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex-shrink-0">{card.icon}</div>
            <div>
              <p className={`text-3xl font-bold ${card.textClass}`}>{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '360ms' }}>
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
            <p className="text-gray-500 text-sm mb-4">No hay incidentes reportados aún.</p>
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
