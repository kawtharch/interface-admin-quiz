import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Import des pages Admin
import DashboardAdmin from './pages/DashboardAdmin';
import ListUsers from './pages/Users/ListUsers';
import ListQuiz from './pages/Quizzes/ListQuiz';
import ListAbonnement from './pages/Abonnements/ListAbonnement';
import ListReclamation from './pages/Reclamations/ListReclamation';

// Import du Layout Admin (Sidebar + Header)
import AdminLayout from './components/AdminLayout';

// Page de Login (optionnelle)
import Login from './pages/Login';

function App() {
  // État pour gérer l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mettre false en production
  const [userRole, setUserRole] = useState('admin'); // admin, professor, student

  // Composant pour protéger les routes admin
  const ProtectedAdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (userRole !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Route de Login */}
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} 
        />

        {/* Routes Admin avec Layout */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Routes>
                  <Route index element={<DashboardAdmin />} />
                  <Route path="dashboard" element={<DashboardAdmin />} />
                  <Route path="users" element={<ListUsers />} />
                  <Route path="quizzes" element={<ListQuiz />} />
                  <Route path="subscriptions" element={<ListAbonnement />} />
                  <Route path="reclamations" element={<ListReclamation />} />
                </Routes>
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />

        {/* Route par défaut */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />

        {/* Page Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

// Composant Page 404
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
        <a 
          href="/admin/dashboard" 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retour au Dashboard
        </a>
      </div>
    </div>
  );
}

// Composant Page Unauthorized
function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-8">Accès non autorisé</p>
        <a 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </a>
      </div>
    </div>
  );
}

export default App;