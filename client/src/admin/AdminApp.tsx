import { Routes, Route, Navigate } from 'react-router-dom';
import { FournisseurAuth, RouteProtegee } from './lib/auth';
import { AdminLayout } from './components/AdminLayout';
import AdminLogin from './pages/Login';
import AdminDashboard from './pages/Dashboard';
import AdminLeads from './pages/Leads';
import AdminLeadDetail from './pages/LeadDetail';
import AdminTags from './pages/Tags';
import AdminExport from './pages/Export';

// Coquille SPA du back-office, en rendu client uniquement (CSR), protégée
// par authentification. Routes internes sous /admin/*.

export default function AdminApp() {
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
          <Route path="tags" element={<AdminTags />} />
          <Route path="export" element={<AdminExport />} />
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </FournisseurAuth>
  );
}
