import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createIncident } from '../../services/incidentService';
import { uploadIncidentImage } from '../../services/storageService';
import Alert from '../../components/ui/Alert/Alert';

const TIPOS = [
  'Baño/Sanitario',
  'Eléctrico',
  'Infraestructura',
  'Seguridad',
  'Plomería',
  'Mobiliario',
  'Tecnología',
  'Otro',
];

const UBICACIONES = [
  'Bloque 1',
  'Bloque 2',
  'Bloque 2 piso 2',
  'Bloque 3',
  'Bloque 4',
  'Bloque 5',
  'Bloque 5 piso 2',
  'Bloque 6',
  'Bloque 7',
  'Bloque 7 piso 2',
  'Biblioteca',
  'Laboratorios',
  'Auditorio',
  'Baños',
  'Otro',
];

export default function ReportIncidentPage() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [ubicacionTexto, setUbicacionTexto] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagenPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function handleGetLocation() {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('La geolocalización no está disponible en tu navegador.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude);
        setLongitud(position.coords.longitude);
        setGpsLoading(false);
      },
      (err) => {
        setGpsError('No se pudo obtener la ubicación. Verifica los permisos.');
        setGpsLoading(false);
        console.error(err);
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!tipo) return setError('Selecciona el tipo de incidente.');
    if (descripcion.trim().length < 20)
      return setError('La descripción debe tener al menos 20 caracteres.');
    if (!imagen) return setError('Debes adjuntar una fotografía del incidente.');
    if (!ubicacionTexto.trim()) return setError('La ubicación es requerida.');

    setLoading(true);
    try {
      const imagenURL = await uploadIncidentImage(imagen, currentUser.uid);
      await createIncident({
        usuarioId: currentUser.uid,
        usuarioNombre: userProfile?.nombre || currentUser.email,
        tipo,
        descripcion: descripcion.trim(),
        imagenURL,
        ubicacionTexto: ubicacionTexto.trim(),
        latitud,
        longitud,
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-incidents'), 2000);
    } catch (err) {
      console.error(err);
      setError('Error al enviar el reporte. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reporte enviado</h2>
        <p className="text-gray-500">Tu incidente fue registrado correctamente. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reportar Incidente</h1>
        <p className="text-gray-500 mt-1">Completa el formulario para registrar un nuevo incidente.</p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de incidente <span className="text-red-500">*</span>
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
          >
            <option value="">Selecciona un tipo...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Descripcion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
            placeholder="Describe el incidente con detalle (mínimo 20 caracteres)..."
          />
          <p className="text-xs text-gray-400 mt-1">{descripcion.length} caracteres{descripcion.length < 20 && ' (mínimo 20)'}</p>
        </div>

        {/* Fotografía */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fotografía <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              id="foto-input"
              className="hidden"
            />
            <label htmlFor="foto-input" className="cursor-pointer">
              {imagenPreview ? (
                <div>
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="max-h-48 mx-auto rounded-lg object-contain mb-2"
                  />
                  <p className="text-xs text-primary-700">Clic para cambiar la imagen</p>
                </div>
              ) : (
                <div className="py-4">
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Clic para subir una imagen</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP hasta 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={UBICACIONES.includes(ubicacionTexto) ? ubicacionTexto : ''}
              onChange={(e) => setUbicacionTexto(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
            >
              <option value="">Selecciona una ubicación...</option>
              {UBICACIONES.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={ubicacionTexto}
            onChange={(e) => setUbicacionTexto(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            placeholder="O escribe la ubicación específica..."
          />
        </div>

        {/* GPS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación GPS (opcional)
          </label>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={gpsLoading}
            className="inline-flex items-center space-x-2 border border-primary-600 text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{gpsLoading ? 'Obteniendo...' : 'Obtener mi ubicación'}</span>
          </button>
          {gpsError && <p className="text-red-500 text-xs mt-1">{gpsError}</p>}
          {latitud && longitud && (
            <p className="text-xs text-primary-600 mt-1">
              Ubicación obtenida: {latitud.toFixed(5)}, {longitud.toFixed(5)}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 bg-primary-700 hover:bg-primary-800 disabled:bg-primary-800"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando reporte...</span>
              </>
            ) : (
              <span>Enviar Reporte</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
