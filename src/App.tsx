import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
/* import { Clientes } from './pages/Clientes';
import { Vehiculos } from './pages/Vehiculos';
import { OrdenesServicio } from './pages/OrdenesServicio';
import { MisOrdenes } from './pages/MisOrdenes';
import { Inventario } from './pages/Inventario';
import { Facturacion } from './pages/Facturacion';
import { Usuarios } from './pages/Usuarios';
import { Configuracion } from './pages/Configuracion'; */

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
        } 
      />
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
      {/* <Route
        path="/clientes"
        element={
          <ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
            <Layout>
              <Clientes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehiculos"
        element={
          <ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
            <Layout>
              <Vehiculos />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ordenes"
        element={
          <ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
            <Layout>
              <OrdenesServicio />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-ordenes"
        element={
          <ProtectedRoute allowedRoles={['mecanico']}>
            <Layout>
              <MisOrdenes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario"
        element={
          <ProtectedRoute>
            <Layout>
              <Inventario />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/facturacion"
        element={
          <ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
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
        path="/configuracion"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <Layout>
              <Configuracion />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
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