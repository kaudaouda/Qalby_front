import { Routes, Route } from 'react-router-dom';
import { HomePage } from './features/home/HomePage';
import { Login } from './features/users/Login';
import { Register } from './features/users/Register';
import { CampaignPage } from './features/funds/CampaignPage';
import { CreateFund } from './features/funds/CreateFund';
import { ExploreFunds } from './features/funds/ExploreFunds';
import { PaymentPage } from './features/payment/PaymentPage';
import { AuthInitializer, ProtectedRoute } from './components/common';

function App() {
  return (
    <>
      <AuthInitializer />
      <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<HomePage />} />

      {/* Routes d'authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes des cagnottes */}
      <Route path="/campaigns" element={<ExploreFunds />} />
      <Route path="/campaign/:id" element={<CampaignPage />} />
      <Route path="/payment/:fundId" element={<PaymentPage />} />
      <Route 
        path="/create-fund" 
        element={
          <ProtectedRoute>
            <CreateFund />
          </ProtectedRoute>
        } 
      />

      {/* Dashboard - Route protégée */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold text-primary-600">Dashboard - En cours de développement</h1>
            </div>
          </ProtectedRoute>
        } 
      />
    </Routes>
    </>
  );
}

export default App;
