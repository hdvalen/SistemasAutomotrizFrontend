import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { HomePage } from './pages/homepages';
import { Clientes } from './pages/Clientes';
import { Vehiculos } from './pages/Vehiculos';
import { Usuarios } from './pages/Usuarios';
import { Inventario } from './pages/Inventario';
import { OrdenesServicio } from './pages/OrdenesServicio';
import { Facturacion } from './pages/Facturacion';
import { Historial } from './pages/Historial';
import { Diagnostico } from './pages/Diagnostico';
import { DetallesOrden } from './pages/DetallesOrden';
import { Estados } from './pages/Estados';
import { TipodeServicio } from './pages/TipodeServicio';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />

  <Route path="/login" element={<LoginForm />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    }
  />
  <Route
    path="/homepages"
    element={
        <Layout>
          <HomePage />
        </Layout>

    }
  />

      {
        <><Route
          path="/clientes"
          element={<ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
            <Layout>
              <Clientes />
            </Layout>
          </ProtectedRoute>} /><Route
            path="/vehiculos"
            element={<ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
              <Layout>
                <Vehiculos />
              </Layout>
            </ProtectedRoute>} />
            <Route
                path="/inventario"
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <Layout>
                      <Inventario />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facturacion"
                element={
                  <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
                    <Layout>
                      <Facturacion />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            <Route
            path="/usuarios"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Layout>
                  <Usuarios />
                </Layout>
              </ProtectedRoute>
            }
          />
            <Route
          path="/ordenes"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'recepcionista', 'mecanico']}>
              <Layout>
                <OrdenesServicio />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordenDetalles"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'mecanico']}>
              <Layout>
                <DetallesOrden />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostico"
          element={
            <ProtectedRoute allowedRoles={['administrador','recepcionista']}>
              <Layout>
                <Diagnostico />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Layout>
                <Historial />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estados"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Layout>
                <Estados />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipodeservicio"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Layout>
                <TipodeServicio />
              </Layout>
            </ProtectedRoute>
          }
        />
          </>

      }
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;