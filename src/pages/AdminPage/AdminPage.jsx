import { useState, useEffect } from 'react';
import { getIncidents, updateIncidentStatus, groupIncidents, updateGroupStatus, deleteIncident, markIncidentNotified } from '../../services/incidentService';
import { deleteIncidentImage } from '../../services/storageService';
import { notifyAdmins } from '../../services/notificationService';
import IncidentStatusBadge from '../../components/incidents/IncidentStatusBadge/IncidentStatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Alert from '../../components/ui/Alert/Alert';
import { Link } from 'react-router-dom';

const ESTADOS = ['Todos', 'Reportado', 'En proceso', 'Resuelto'];
const TIPOS = ['Todos', 'Baño/Sanitario', 'Eléctrico', 'Infraestructura', 'Seguridad', 'Plomería', 'Mobiliario', 'Tecnología', 'Otro'];

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');

  const [selected, setSelected] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [grouping, setGrouping] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getIncidents();
      setIncidents(data);
      await checkStuckIncidents(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los incidentes.');
    } finally {
      setLoading(false);
    }
  }

  async function checkStuckIncidents(loadedIncidents) {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const stuck = loadedIncidents.filter((i) => {
      if (i.estado === 'Resuelto' || i.notificacionEstancadoEnviada) return false;
      const fecha = i.fechaCreacion?.toDate?.() ?? new Date(i.fechaCreacion);
      return fecha < threeDaysAgo;
    });

    for (const inc of stuck) {
      await notifyAdmins(
        `El incidente "${inc.tipo}" en ${inc.ubicacionTexto} lleva más de 3 días sin resolverse`,
        'incidente_estancado',
        inc.id
      );
      await markIncidentNotified(inc.id);
    }

    if (stuck.length > 0) {
      setIncidents((prev) =>
        prev.map((i) =>
          stuck.find((s) => s.id === i.id)
            ? { ...i, notificacionEstancadoEnviada: true }
            : i
        )
      );
    }
  }

  async function handleStatusChange(incident, newEstado) {
    setUpdatingId(incident.id);
    setError('');
    try {
      if (incident.grupoId) {
        await updateGroupStatus(incident.grupoId, newEstado);
        setIncidents((prev) =>
          prev.map((i) =>
            i.grupoId === incident.grupoId ? { ...i, estado: newEstado } : i
          )
        );
        setSuccess(`Estado actualizado para todo el grupo (${incident.grupoId.substring(0, 8)}).`);
      } else {
        await updateIncidentStatus(incident.id, newEstado);
        setIncidents((prev) =>
          prev.map((i) => (i.id === incident.id ? { ...i, estado: newEstado } : i))
        );
        setSuccess('Estado actualizado correctamente.');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  }

  function toggleSelect(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function selectAll() {
    const ids = filtered.map((i) => i.id);
    setSelected(ids);
  }

  function clearSelection() {
    setSelected([]);
  }

  async function handleGroup() {
    if (selected.length < 2) {
      setError('Debes seleccionar al menos 2 incidentes para agrupar.');
      return;
    }
    setGrouping(true);
    setError('');
    try {
      const grupoId = 'grupo_' + Date.now();
      await groupIncidents(selected, grupoId);
      setIncidents((prev) =>
        prev.map((i) =>
          selected.includes(i.id) ? { ...i, grupoId } : i
        )
      );
      setSuccess(`${selected.length} incidentes agrupados bajo el grupo ${grupoId.substring(0, 14)}.`);
      setSelected([]);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Error al agrupar los incidentes.');
    } finally {
      setGrouping(false);
    }
  }

  async function handleDelete(incident) {
    setDeletingId(incident.id);
    setConfirmDelete(null);
    setError('');
    try {
      await deleteIncidentImage(incident.imagenURL);
      await deleteIncident(incident.id);
      setIncidents((prev) => prev.filter((i) => i.id !== incident.id));
      setSelected((prev) => prev.filter((x) => x !== incident.id));
      setSuccess('Incidente eliminado correctamente.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el incidente.');
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = incidents.filter((i) => {
    const estadoOk = filterEstado === 'Todos' || i.estado === filterEstado;
    const tipoOk = filterTipo === 'Todos' || i.tipo === filterTipo;
    return estadoOk && tipoOk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">Gestiona todos los incidentes reportados en el campus.</p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          {filtered.length} incidente{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-primary-800 text-sm font-medium">
            {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleGroup}
            disabled={grouping || selected.length < 2}
            className="text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-60 bg-primary-700 hover:bg-primary-800"
          >
            {grouping ? 'Agrupando...' : 'Agrupar seleccionados'}
          </button>
          <button
            onClick={clearSelection}
            className="text-primary-700 hover:text-primary-900 text-sm transition-colors"
          >
            Limpiar selección
          </button>
          <button
            onClick={selectAll}
            className="text-primary-700 hover:text-primary-900 text-sm transition-colors"
          >
            Seleccionar todos ({filtered.length})
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Cargando incidentes..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm">No hay incidentes que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={() =>
                        selected.length === filtered.length ? clearSelection() : selectAll()
                      }
                      className="rounded border-gray-300 text-primary-700 focus:ring-primary-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Descripción</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Ubicación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reportado por</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Cambiar estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Grupo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Detalle</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((incident) => (
                  <tr
                    key={incident.id}
                    className={
                      "hover:bg-gray-50 transition-colors " +
                      (selected.includes(incident.id) ? 'bg-primary-50' : '')
                    }
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(incident.id)}
                        onChange={() => toggleSelect(incident.id)}
                        className="rounded border-gray-300 text-primary-700 focus:ring-primary-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {incident.tipo}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px]">
                      <p className="truncate">{incident.descripcion}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{incident.ubicacionTexto}</td>
                    <td className="px-4 py-3 text-gray-600">{incident.usuarioNombre}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(incident.fechaCreacion)}
                    </td>
                    <td className="px-4 py-3">
                      <IncidentStatusBadge estado={incident.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={incident.estado}
                        onChange={(e) => handleStatusChange(incident, e.target.value)}
                        disabled={updatingId === incident.id}
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white disabled:opacity-50"
                      >
                        <option value="Reportado">Reportado</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Resuelto">Resuelto</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {incident.grupoId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                          {incident.grupoId.substring(0, 12)}...
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={"/incident/" + incident.id}
                        className="text-primary-700 hover:text-primary-900 text-xs font-medium transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setConfirmDelete(incident)}
                        disabled={deletingId === incident.id}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                        title="Eliminar incidente"
                      >
                        {deletingId === incident.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Eliminar incidente</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Se eliminará el incidente <span className="font-medium">"{confirmDelete.tipo}"</span> reportado por <span className="font-medium">{confirmDelete.usuarioNombre}</span>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
