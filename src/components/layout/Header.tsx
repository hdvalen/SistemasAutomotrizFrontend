import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search input */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar clientes, vehículos, órdenes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 shadow-inner bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Notifications and user info */}
        <div className="flex items-center space-x-4 ml-6">
          <button className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition duration-200">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-3 w-3 bg-pink-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.nombre}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
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
