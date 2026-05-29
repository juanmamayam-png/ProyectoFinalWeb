import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/ui/Alert/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con ese correo.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  const features = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      ),
      title: 'Reporta incidentes',
      desc: 'Registra problemas de infraestructura, seguridad o mantenimiento.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      ),
      title: 'Seguimiento en tiempo real',
      desc: 'Consulta el estado de tus reportes.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      ),
      title: 'Ubicación exacta',
      desc: 'Adjunta fotos y coordenadas GPS.',
    },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-8 text-white bg-gradient-to-br from-primary-800 to-primary-700">
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-xl">
            <img
              src="/Icons/Logouniamazonia.png"
              alt="Logo Universidad de la Amazonia"
              className="h-28 w-auto object-contain"
            />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold leading-tight mb-1 text-center">
          Gestión de Incidentes del Campus
        </h2>
        <p className="text-primary-200 text-sm text-center mb-6">
          Sitio oficial de la Universidad de la Amazonia.
        </p>

        <div className="space-y-3 flex flex-col items-center">
          {features.map((f, i) => (
            <div key={f.title} className="bg-white rounded-xl px-4 py-3 shadow-md flex items-center gap-3 w-80 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-primary-100 rounded-lg">
                <svg className="w-4 h-4 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-primary-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-4">
            <div className="inline-block bg-white rounded-2xl px-5 py-2 shadow-md mb-2">
              <img
                src="/Icons/Logouniamazonia.png"
                alt="Logo Universidad de la Amazonia"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Incidentes UniAmazonia</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 animate-fade-in-up">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-gray-900">Iniciar sesión</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                Accede con tu cuenta institucional para continuar.
              </p>
            </div>

            {error && <Alert type="error" message={error} className="mb-3" />}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="correo@udla.edu.co"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-primary-600 disabled:opacity-70 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-700 hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
