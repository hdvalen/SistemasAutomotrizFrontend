import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Wrench, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-white py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full shadow-lg">
              <Wrench className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
            AutoTaller Manager
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Sistema de Gestión de Taller Automotriz
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition duration-300"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>

        {/* Cuentas de prueba */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Cuentas de Prueba
          </h3>
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
              <strong className="text-indigo-600">Administrador:</strong>
              <span>admin@autotaller.com / admin123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
              <strong className="text-purple-600">Recepcionista:</strong>
              <span>recepcionista@autotaller.com / recep123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
              <strong className="text-pink-600">Mecánico:</strong>
              <span>mecanico@autotaller.com / mec123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
