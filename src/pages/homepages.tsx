import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Wrench } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-white px-4 py-12">
      <div className="max-w-xl text-center space-y-6 bg-white/80 p-10 rounded-2xl shadow-xl border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full shadow-md">
            <Wrench className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
          Bienvenido a AutoTaller
        </h1>
        <p className="text-neutral-600 text-lg">
          Gestiona tu taller automotriz de forma profesional y moderna.
        </p>

        {/* Botón */}
        <Button
          onClick={handleLoginRedirect}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-6 py-3 rounded-xl shadow-lg transition duration-300"
        >
          Iniciar Sesión
        </Button>
      </div>
    </div>
  );
}
