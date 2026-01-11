import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { LotsPage } from '@/pages/LotsPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { StatementsPage } from '@/pages/StatementsPage';
import { MyStatementPage } from '@/pages/MyStatementPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Rutas para admin/comercial */}
              <Route
                path="projects"
                element={
                  <ProtectedRoute allowedRoles={['master', 'admin', 'comercial']}>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="projects/:id"
                element={
                  <ProtectedRoute allowedRoles={['master', 'admin', 'comercial']}>
                    <ProjectDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="lots"
                element={
                  <ProtectedRoute allowedRoles={['master', 'admin', 'comercial']}>
                    <LotsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="clients"
                element={
                  <ProtectedRoute allowedRoles={['master', 'admin', 'comercial']}>
                    <ClientsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payments"
                element={
                  <ProtectedRoute allowedRoles={['master', 'admin', 'comercial']}>
                    <PaymentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="statements"
                element={
                  <ProtectedRoute allowedRoles={['master', 'admin', 'comercial']}>
                    <StatementsPage />
                  </ProtectedRoute>
                }
              />

              {/* Ruta para cliente */}
              <Route
                path="my-statement"
                element={
                  <ProtectedRoute allowedRoles={['cliente']}>
                    <MyStatementPage />
                  </ProtectedRoute>
                }
              />

              {/* Ruta para master */}
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['master']}>
                    <div className="p-4">
                      <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                      <p className="text-muted-foreground mt-2">
                        Esta funcionalidad estará disponible próximamente.
                      </p>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
