import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Wrench, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Credenciales inválidas. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-4 rounded-full shadow-lg">
              <Wrench className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            AutoTaller Manager
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Sistema de Gestión de Taller Automotriz
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800 space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="text-white"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="text-white"
            />

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg transition duration-300"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>

        {/* Cuentas de prueba */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-md border border-neutral-800">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Cuentas de Prueba
          </h3>
          <div className="space-y-3 text-sm text-neutral-300">
            <div className="flex justify-between items-center p-2 bg-neutral-800 rounded-lg">
              <strong className="text-blue-400">Administrador:</strong>
              <span>admin@autotaller.com / admin123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-neutral-800 rounded-lg">
              <strong className="text-purple-400">Recepcionista:</strong>
              <span>recepcionista@autotaller.com / recep123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-neutral-800 rounded-lg">
              <strong className="text-pink-400">Mecánico:</strong>
              <span>mecanico@autotaller.com / mec123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
