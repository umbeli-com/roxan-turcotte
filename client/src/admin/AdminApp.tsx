import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FournisseurAuth, RouteProtegee } from './lib/auth';
import { AdminLayout } from './components/AdminLayout';
import AdminLogin from './pages/Login';
import AdminDashboard from './pages/Dashboard';
import AdminLeads from './pages/Leads';
import AdminLeadDetail from './pages/LeadDetail';
import AdminPartenaires from './pages/Partenaires';
import AdminTags from './pages/Tags';
import AdminExport from './pages/Export';

// Coquille SPA du back-office, en rendu client uniquement (CSR), protégée
// par authentification. Routes internes sous /admin/*.

export default function AdminApp() {
  // vite-react-ssg pré-rend cette route, mais l'intention est CSR pur (cf.
  // routes.tsx). On rend null à l'hydratation initiale puis on monte le vrai
  // contenu après — évite les erreurs React #418 / #423 (mismatch entre le
  // HTML pré-rendu et le rendu client) que provoquaient les routes internes.
  const [monte, setMonte] = useState(false);
  useEffect(() => {
    setMonte(true);
  }, []);
  if (!monte) return null;

  return (
    <FournisseurAuth>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          element={
            <RouteProtegee>
              <AdminLayout />
            </RouteProtegee>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="leads/:id" element={<AdminLeadDetail />} />
          <Route path="partenaires" element={<AdminPartenaires />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="export" element={<AdminExport />} />
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </FournisseurAuth>
  );
}
