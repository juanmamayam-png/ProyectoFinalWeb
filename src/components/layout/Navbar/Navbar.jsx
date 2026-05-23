import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

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
      : 'text-primary-100 hover:text-white transition-colors duration-150';
  }

  return (
    <nav className="shadow-lg bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/src/Icons/LogoUANegativo.png"
                alt="Logo Universidad de la Amazonia"
                className="h-14 w-auto object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
              />
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
                <p className="text-primary-200 text-xs">Administrador</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-primary-800 hover:bg-primary-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors duration-150 border border-primary-700"
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
        <div className="md:hidden bg-primary-900 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            className="block text-primary-100 hover:text-white py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/report"
            className="block text-primary-100 hover:text-white py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Reportar Incidente
          </Link>
          <Link
            to="/my-incidents"
            className="block text-primary-100 hover:text-white py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Mis Incidentes
          </Link>
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="block text-primary-100 hover:text-white py-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Panel Admin
              </Link>
              <Link
                to="/statistics"
                className="block text-primary-100 hover:text-white py-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Estadísticas
              </Link>
            </>
          )}
          <div className="border-t border-primary-700 pt-3 mt-2">
            <p className="text-white text-sm font-medium">
              {userProfile?.nombre || currentUser?.email}
            </p>
            {isAdmin && (
              <p className="text-primary-300 text-xs mb-2">Administrador</p>
            )}
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="mt-2 w-full bg-primary-800 hover:bg-primary-700 text-white text-sm px-3 py-2 rounded-md transition-colors duration-150"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
