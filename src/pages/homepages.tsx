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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl text-center border border-slate-200">
        {/* Logo */}
        <div className="flex justify-center items-center mb-6">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 p-4 rounded-full shadow-md">
            <Wrench className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent mb-4">
          Bienvenido a AutoTaller
        </h1>
        <p className="text-slate-600 mb-8 text-lg">
          Gestiona tu taller automotriz de forma profesional y moderna.
        </p>

        {/* Botón */}
        <Button
          onClick={handleLoginRedirect}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:brightness-110 transition"
        >
          Iniciar Sesión
        </Button>
      </div>
    </div>
  );
}
