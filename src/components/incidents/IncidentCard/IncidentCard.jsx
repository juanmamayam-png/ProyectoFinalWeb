import { Link } from 'react-router-dom';
import IncidentStatusBadge from '../IncidentStatusBadge/IncidentStatusBadge';

function formatDate(timestamp) {
  if (!timestamp) return 'Fecha desconocida';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
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

export default function IncidentCard({ incident }) {
  const {
    id,
    tipo,
    descripcion,
    ubicacionTexto,
    estado,
    fechaCreacion,
    usuarioNombre,
    imagenURL,
    grupoId,
  } = incident;

  const truncated = descripcion && descripcion.length > 100
    ? descripcion.substring(0, 100) + '...'
    : descripcion;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      {imagenURL && (
        <div className="h-36 overflow-hidden">
          <img
            src={imagenURL}
            alt="Imagen del incidente"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg" aria-hidden="true">
              {tipoIcons[tipo] || '📋'}
            </span>
            <span className="font-semibold text-gray-800 text-sm">{tipo}</span>
          </div>
          <IncidentStatusBadge estado={estado} />
        </div>

        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{truncated}</p>

        <div className="space-y-1 mb-3">
          {ubicacionTexto && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {ubicacionTexto}
            </div>
          )}
          {usuarioNombre && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {usuarioNombre}
            </div>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(fechaCreacion)}
          </div>
        </div>

        {grupoId && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
              Grupo: {grupoId.substring(0, 8)}...
            </span>
          </div>
        )}

        <Link
          to={`/incident/${id}`}
          className="inline-flex items-center text-primary-700 hover:text-primary-900 text-sm font-medium transition-colors duration-150"
        >
          Ver detalle
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
