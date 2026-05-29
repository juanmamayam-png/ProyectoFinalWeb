import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIncidentById } from '../../services/incidentService';
import { useAuth } from '../../contexts/AuthContext';
import IncidentStatusBadge from '../../components/incidents/IncidentStatusBadge/IncidentStatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Alert from '../../components/ui/Alert/Alert';

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
  const [imgOpen, setImgOpen] = useState(false);

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
          className="mt-4 text-primary-700 hover:underline text-sm"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-primary-700 hover:text-primary-900 text-sm font-medium mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">

          <div
            className="md:w-1/2 bg-gray-100 flex items-center justify-center min-h-64 cursor-zoom-in border-b md:border-b-0 md:border-r border-gray-200"
            onClick={() => incident.imagenURL && setImgOpen(true)}
          >
            {incident.imagenURL ? (
              <img
                src={incident.imagenURL}
                alt="Fotografía del incidente"
                className="w-full h-full object-contain max-h-[480px]"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-300 p-8">
                <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Sin imagen</p>
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-6 flex flex-col space-y-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl" aria-hidden="true">{tipoIcons[incident.tipo] || '📋'}</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{incident.tipo}</h1>
                  <p className="text-xs text-gray-400">ID: {incident.id}</p>
                </div>
              </div>
              <IncidentStatusBadge estado={incident.estado} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-gray-800 text-sm leading-relaxed">{incident.descripcion}</p>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-400">Ubicación</p>
                  <p className="text-sm text-gray-800">{incident.ubicacionTexto}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-400">Reportado por</p>
                  <p className="text-sm text-gray-800">{incident.usuarioNombre}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-400">Fecha</p>
                  <p className="text-sm text-gray-800">{formatDate(incident.fechaCreacion)}</p>
                </div>
              </div>
            </div>

            {incident.latitud && incident.longitud && (
              <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-xs font-semibold text-primary-700 mb-1">Coordenadas GPS</p>
                <p className="text-primary-900 text-sm">{incident.latitud.toFixed(6)}, {incident.longitud.toFixed(6)}</p>
                <a
                  href={`https://www.google.com/maps?q=${incident.latitud},${incident.longitud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-700 hover:underline"
                >
                  Ver en Google Maps →
                </a>
              </div>
            )}

            {incident.grupoId && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs text-purple-700">
                  <span className="font-semibold">Grupo:</span> {incident.grupoId}
                </p>
              </div>
            )}

            {isAdmin && (
              <div className="pt-2 border-t border-gray-100 mt-auto">
                <Link
                  to="/admin"
                  className="text-primary-700 hover:text-primary-900 text-sm font-medium transition-colors"
                >
                  Gestionar en panel de administración →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {imgOpen && incident.imagenURL && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setImgOpen(false)}
        >
          <img
            src={incident.imagenURL}
            alt="Fotografía del incidente"
            className="max-h-full max-w-full rounded-lg shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
