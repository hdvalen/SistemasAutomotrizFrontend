import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-zinc-900 shadow-md border-b border-zinc-700">
  <div className="flex items-center justify-between h-16 px-6">
    {/* Search input */}
    <div className="flex-1 max-w-lg">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar clientes, vehículos, órdenes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-700 shadow-inner bg-zinc-800 text-sm text-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
      </div>
    </div>

    {/* Notifications and user info */}
    <div className="flex items-center space-x-4 ml-6">
      <button className="relative p-2.5 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded-xl transition duration-200">
        <Bell className="h-6 w-6" />
        <span className="absolute top-1 right-1 h-3 w-3 bg-pink-500 rounded-full border-2 border-zinc-900"></span>
      </button>

      <div className="flex items-center space-x-4 pl-4 border-l border-zinc-700">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{user?.nombre}</p>
          <p className="text-xs text-zinc-400 capitalize">{user?.rol}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
          <span className="text-sm font-bold text-white">
            {user?.nombre.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  </div>
</header>

  );
}
