import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserIncidents } from '../../services/incidentService';
import IncidentCard from '../../components/incidents/IncidentCard/IncidentCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Alert from '../../components/ui/Alert/Alert';
import { Link } from 'react-router-dom';

const FILTERS = ['Todos', 'Reportado', 'En proceso', 'Resuelto'];

export default function MyIncidentsPage() {
  const { currentUser } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    async function loadIncidents() {
      try {
        const data = await getUserIncidents(currentUser.uid);
        setIncidents(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar tus incidentes.');
      } finally {
        setLoading(false);
      }
    }
    loadIncidents();
  }, [currentUser]);

  const filtered =
    activeFilter === 'Todos'
      ? incidents
      : incidents.filter((i) => i.estado === activeFilter);

  const countFor = (filter) =>
    filter === 'Todos'
      ? incidents.length
      : incidents.filter((i) => i.estado === filter).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Incidentes</h1>
          <p className="text-gray-500 mt-1">Historial de tus reportes enviados.</p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center space-x-2 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm bg-primary-700 hover:bg-primary-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Reporte</span>
        </Link>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors " +
              (activeFilter === filter
                ? 'bg-primary-700 text-white border-primary-700'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-700')
            }
          >
            {filter}
            <span className="ml-1.5 bg-opacity-20 text-xs font-normal">
              ({countFor(filter)})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Cargando incidentes..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {activeFilter === 'Todos' ? (
            <>
              <p className="text-gray-500 text-sm mb-4">No has reportado incidentes aun.</p>
              <Link
                to="/report"
                className="inline-block text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-primary-700 hover:bg-primary-800"
              >
                Reportar primer incidente
              </Link>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              No tienes incidentes con estado "{activeFilter}".
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
