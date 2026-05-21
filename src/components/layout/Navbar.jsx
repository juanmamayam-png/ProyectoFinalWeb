import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = userProfile?.rol === 'admin';

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  function isActive(path) {
    return location.pathname === path
      ? 'text-white font-semibold border-b-2 border-white'
      : 'text-blue-100 hover:text-white transition-colors duration-150';
  }

  return (
    <nav className="bg-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-bold text-sm">UA</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                UniAmazonia Incidentes
              </span>
              <span className="text-white font-bold text-base sm:hidden">
                UA Incidentes
              </span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActive('/')}>
              Inicio
            </Link>
            <Link to="/report" className={isActive('/report')}>
              Reportar
            </Link>
            <Link to="/my-incidents" className={isActive('/my-incidents')}>
              Mis Incidentes
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin" className={isActive('/admin')}>
                  Panel Admin
                </Link>
                <Link to="/statistics" className={isActive('/statistics')}>
                  Estadísticas
                </Link>
              </>
            )}
          </div>

          {/* User info + logout */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-white text-sm font-medium">
                {userProfile?.nombre || currentUser?.email}
              </p>
              {isAdmin && (
                <p className="text-blue-200 text-xs">Administrador</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md transition-colors duration-150 border border-blue-500"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            className="block text-blue-100 hover:text-white py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/report"
            className="block text-blue-100 hover:text-white py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Reportar Incidente
          </Link>
          <Link
            to="/my-incidents"
            className="block text-blue-100 hover:text-white py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Mis Incidentes
          </Link>
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="block text-blue-100 hover:text-white py-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Panel Admin
              </Link>
              <Link
                to="/statistics"
                className="block text-blue-100 hover:text-white py-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Estadísticas
              </Link>
            </>
          )}
          <div className="border-t border-blue-600 pt-3 mt-2">
            <p className="text-white text-sm font-medium">
              {userProfile?.nombre || currentUser?.email}
            </p>
            {isAdmin && (
              <p className="text-blue-300 text-xs mb-2">Administrador</p>
            )}
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-2 rounded-md transition-colors duration-150"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
