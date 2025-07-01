import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Wrench, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SketchfabEmbed2 } from '../ui/SketchEmbed';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);

      // Espera 100ms para asegurarte que el contexto se actualizó antes de redirigir
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);

    } catch {
      setError('Credenciales inválidas. Verifica tu usuario y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-4 rounded-full shadow-lg">
              <Wrench className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            AutoTaller Manager
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sistema de Gestión de Taller Automotriz
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-700 space-y-6">
            <Input
              label="Nombre de usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
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
              <div className="flex items-center gap-2 p-3 bg-red-200 border border-red-400 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-700" />
                <span className="text-sm text-red-800">{error}</span>
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

        <div className="bg-zinc-900 p-6 rounded-2xl shadow-md border border-zinc-700">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Cuentas de Prueba
          </h3>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="flex justify-between items-center p-2 bg-zinc-800 rounded-lg">
              <strong className="text-indigo-400">Administrador:</strong>
              <span>admin / admin123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800 rounded-lg">
              <strong className="text-purple-400">Recepcionista:</strong>
              <span>recepcionista / recep123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800 rounded-lg">
              <strong className="text-pink-400">Mecánico:</strong>
              <span>mecanico / mec123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}