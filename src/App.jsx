import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/layout/PublicRoute/PublicRoute';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ReportIncidentPage from './pages/ReportIncidentPage/ReportIncidentPage';
import MyIncidentsPage from './pages/MyIncidentsPage/MyIncidentsPage';
import IncidentDetailPage from './pages/IncidentDetailPage/IncidentDetailPage';
import AdminPage from './pages/AdminPage/AdminPage';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage';
import { useAuth } from './contexts/AuthContext';

function Layout({ children }) {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {currentUser && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <Layout>
              <ReportIncidentPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-incidents"
        element={
          <ProtectedRoute>
            <Layout>
              <MyIncidentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/incident/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <IncidentDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <Layout>
              <AdminPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute adminOnly={true}>
            <Layout>
              <StatisticsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
