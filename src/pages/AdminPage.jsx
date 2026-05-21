import { useState, useEffect } from 'react';
import { getIncidents, updateIncidentStatus, groupIncidents, updateGroupStatus } from '../services/incidentService';
import IncidentStatusBadge from '../components/incidents/IncidentStatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los incidentes.');
    } finally {
      setLoading(false);
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

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

      {/* Selection toolbar */}
      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-blue-700 text-sm font-medium">
            {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleGroup}
            disabled={grouping || selected.length < 2}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            {grouping ? 'Agrupando...' : 'Agrupar seleccionados'}
          </button>
          <button
            onClick={clearSelection}
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
          >
            Limpiar selección
          </button>
          <button
            onClick={selectAll}
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
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
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((incident) => (
                  <tr
                    key={incident.id}
                    className={
                      "hover:bg-gray-50 transition-colors " +
                      (selected.includes(incident.id) ? 'bg-blue-50' : '')
                    }
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(incident.id)}
                        onChange={() => toggleSelect(incident.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50"
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
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
