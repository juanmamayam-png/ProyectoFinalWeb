import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIncidentById } from '../services/incidentService';
import { useAuth } from '../contexts/AuthContext';
import IncidentStatusBadge from '../components/incidents/IncidentStatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';

function formatDate(timestamp) {
  if (!timestamp) return 'Fecha desconocida';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const tipoIcons = {
  'Baño/Sanitario': '🚽',
  'Eléctrico': '⚡',
  'Infraestructura': '🏗️',
  'Seguridad': '🔒',
  'Plomería': '🔧',
  'Mobiliario': '🪑',
  'Tecnología': '💻',
  'Otro': '📋',
};

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = userProfile?.rol === 'admin';

  useEffect(() => {
    async function load() {
      try {
        const data = await getIncidentById(id);
        if (!data) {
          setError('Incidente no encontrado.');
        } else {
          setIncident(data);
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar el incidente.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <LoadingSpinner message="Cargando incidente..." />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Image */}
        {incident.imagenURL && (
          <div className="w-full max-h-80 overflow-hidden">
            <img
              src={incident.imagenURL}
              alt="Fotografía del incidente"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl" aria-hidden="true">
                {tipoIcons[incident.tipo] || '📋'}
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{incident.tipo}</h1>
                <p className="text-xs text-gray-400">ID: {incident.id}</p>
              </div>
            </div>
            <IncidentStatusBadge estado={incident.estado} />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Descripción
            </h2>
            <p className="text-gray-800 leading-relaxed">{incident.descripcion}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Ubicación
              </p>
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-800 text-sm">{incident.ubicacionTexto}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Reportado por
              </p>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-800 text-sm">{incident.usuarioNombre}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Fecha
              </p>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-800 text-sm">{formatDate(incident.fechaCreacion)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Estado
              </p>
              <IncidentStatusBadge estado={incident.estado} />
            </div>
          </div>

          {/* GPS Coordinates */}
          {incident.latitud && incident.longitud && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                Coordenadas GPS
              </p>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-blue-800 text-sm font-medium">
                  Latitud: {incident.latitud.toFixed(6)}, Longitud: {incident.longitud.toFixed(6)}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps?q=${incident.latitud},${incident.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-blue-600 hover:underline"
              >
                Ver en Google Maps →
              </a>
            </div>
          )}

          {/* Group info */}
          {incident.grupoId && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-700">
                <span className="font-semibold">Grupo:</span> {incident.grupoId}
              </p>
            </div>
          )}

          {/* Admin action */}
          {isAdmin && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                to="/admin"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Gestionar en panel de administración →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
