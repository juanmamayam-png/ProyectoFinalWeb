import { useEffect, useState } from 'react';
import { getIncidentsByPeriod } from '../../services/incidentService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';

const UA_PRIMARY = '#39a12e';
const COLORS_PIE = ['#ef4444', '#f59e0b', UA_PRIMARY];
const ESTADOS = ['Reportado', 'En proceso', 'Resuelto'];

function getFirstAndLastOfMonth() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return {
    start: first.toISOString().split('T')[0],
    end: last.toISOString().split('T')[0],
  };
}

export default function StatisticsPage() {
  const { start: defaultStart, end: defaultEnd } = getFirstAndLastOfMonth();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getIncidentsByPeriod(startDate, endDate + 'T23:59:59');
      setIncidents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const total = incidents.length;
  const byEstado = ESTADOS.map((e) => ({
    name: e,
    cantidad: incidents.filter((i) => i.estado === e).length,
  }));

  const tiposMap = incidents.reduce((acc, i) => {
    acc[i.tipo] = (acc[i.tipo] || 0) + 1;
    return acc;
  }, {});
  const byTipo = Object.entries(tiposMap).map(([name, cantidad]) => ({ name, cantidad }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
          <p className="text-gray-500 text-sm mt-1">Visualiza el resumen de incidentes por período</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors print:hidden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir / Exportar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-4 print:hidden">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
        <button
          onClick={fetchData}
          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary-700 hover:bg-primary-800"
        >
          Aplicar
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary-700">{total}</p>
              <p className="text-sm text-primary-600 mt-1">Total</p>
            </div>
            {byEstado.map((e, idx) => {
              const colors = ['border-red-200 bg-red-50 text-red-700', 'border-yellow-200 bg-yellow-50 text-yellow-700', 'border-primary-200 bg-primary-50 text-primary-700'];
              return (
                <div key={e.name} className={`border rounded-xl p-4 text-center ${colors[idx]}`}>
                  <p className="text-3xl font-bold">{e.cantidad}</p>
                  <p className="text-sm mt-1">{e.name}</p>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Incidentes por Tipo</h2>
              {byTipo.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={byTipo} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill={UA_PRIMARY} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm text-center py-10">Sin datos en este período</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Incidentes por Estado</h2>
              {total > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={byEstado.filter((e) => e.cantidad > 0)}
                      dataKey="cantidad"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={true}
                    >
                      {byEstado.filter((e) => e.cantidad > 0).map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS_PIE[ESTADOS.indexOf(entry.name)]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm text-center py-10">Sin datos en este período</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">Detalle del Período</h2>
            </div>
            {incidents.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">No hay incidentes en este período.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Tipo</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Descripción</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Ubicación</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Fecha</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {incidents.map((i) => {
                      const fecha = i.fechaCreacion?.toDate
                        ? i.fechaCreacion.toDate().toLocaleDateString('es-CO')
                        : '-';
                      return (
                        <tr key={i.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{i.tipo}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{i.descripcion}</td>
                          <td className="px-4 py-3 text-gray-600">{i.ubicacionTexto}</td>
                          <td className="px-4 py-3 text-gray-500">{fecha}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              i.estado === 'Resuelto' ? 'bg-primary-100 text-primary-700' :
                              i.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {i.estado}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
