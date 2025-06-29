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
    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="bg-zinc-900 text-white rounded-3xl shadow-xl p-10 max-w-xl text-center border border-zinc-700">
  
  {/* Logo */}
  <div className="flex justify-center items-center mb-6">
    <div className="bg-gradient-to-r from-indigo-800 to-purple-800 p-4 rounded-full shadow-md">
      <Wrench className="h-10 w-10 text-white" />
    </div>
  </div>

  {/* Título */}
  <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
    Bienvenido a AutoTaller
  </h1>
  <p className="text-zinc-300 mb-8 text-lg">
    Gestiona tu taller automotriz de forma profesional y moderna.
  </p>

  {/* Botón */}
  <Button
    onClick={handleLoginRedirect}
    className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:brightness-125 transition"
  >
    Iniciar Sesión
  </Button>
</div>
    </div>
  );
}
