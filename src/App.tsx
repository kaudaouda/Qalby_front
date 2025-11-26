import { Routes, Route } from 'react-router-dom';
import { HomePage } from './features/home/HomePage';
import { Login } from './features/users/Login';
import { Register } from './features/users/Register';

function App() {
  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<HomePage />} />

      {/* Routes d'authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Route temporaire pour le dashboard (à développer plus tard) */}
      <Route path="/dashboard" element={<div className="p-8 text-center"><h1 className="text-3xl font-bold text-primary-600">Dashboard - En cours de développement</h1></div>} />
    </Routes>
  );
}

export default App;
