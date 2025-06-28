import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-soft border-b border-neutral-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center flex-1">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar clientes, vehículos, órdenes..."
              className="block w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2.5 text-neutral-400 hover:text-primary-600 relative rounded-xl hover:bg-primary-50 transition-all duration-200">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-3 w-3 bg-secondary-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-neutral-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
              <p className="text-xs text-neutral-500 capitalize">{user?.rol}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
              <span className="text-sm font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}