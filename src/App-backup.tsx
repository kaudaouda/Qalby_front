import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './features/users/Login';
import { Register } from './features/users/Register';

function App() {
  return (
    <Routes>
      {/* Redirection par défaut vers la page de connexion */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Routes d'authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Route temporaire pour le dashboard (à développer plus tard) */}
      <Route path="/dashboard" element={<div className="p-8 text-center"><h1 className="text-3xl font-bold text-primary-600">Dashboard - En cours de développement</h1></div>} />

      {/* Route 404 - Page non trouvée */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
