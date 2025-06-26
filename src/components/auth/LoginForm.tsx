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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 rounded-2xl shadow-strong">
              <Wrench className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-primary-700 to-secondary-600 bg-clip-text text-transparent">
            AutoTaller Manager
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Sistema de Gestión de Taller Automotriz
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-2xl shadow-medium border border-neutral-100 space-y-6">
            <div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div>
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="flex items-center p-4 bg-danger-50 border border-danger-200 rounded-xl">
                <AlertCircle className="h-5 w-5 text-danger-500 mr-3" />
                <span className="text-sm text-danger-700">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-medium"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>

        <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
            Cuentas de Prueba
          </h3>
          <div className="space-y-3 text-xs text-neutral-600">
            <div className="flex justify-between items-center p-2 bg-neutral-50 rounded-lg">
              <strong className="text-primary-700">Administrador:</strong> 
              <span>admin@autotaller.com / admin123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-neutral-50 rounded-lg">
              <strong className="text-secondary-700">Recepcionista:</strong> 
              <span>recepcionista@autotaller.com / recep123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-neutral-50 rounded-lg">
              <strong className="text-accent-700">Mecánico:</strong> 
              <span>mecanico@autotaller.com / mec123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}