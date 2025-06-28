import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Car, 
  ClipboardList, 
  Package, 
  FileText, 
  Settings, 
  LogOut,
  Wrench,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

const navigation = {
  administrador: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Vehículos', href: '/vehiculos', icon: Car },
    { name: 'Órdenes de Servicio', href: '/ordenes', icon: ClipboardList },
    { name: 'Detalles Orden', href: '/ordenDetalles', icon: ClipboardList },
    { name: 'Inventario', href: '/inventario', icon: Package },
    { name: 'Facturación', href: '/facturacion', icon: FileText },
    { name: 'Usuarios', href: '/usuarios', icon: Users },
    { name: 'Historial', href: '/historial', icon: Settings },
    { name: 'Estados', href: '/estados', icon: Users },
    { name: 'Servicios', href: '/tipodeservicio', icon: Settings },
  ],
  recepcionista: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Vehículos', href: '/vehiculos', icon: Car },
    { name: 'Órdenes de Servicio', href: '/ordenes', icon: ClipboardList },
    { name: 'Diagnostico', href: '/diagnostico', icon: Calendar},
  ],
  mecanico: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Órdenes de Servicio', href: '/ordenes', icon: ClipboardList },
    { name: 'Facturación', href: '/facturacion', icon: FileText },
    { name: 'Detalles Orden', href: '/ordenDetalles', icon: ClipboardList },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const userNavigation = navigation[user.rol as 'administrador' | 'recepcionista' | 'mecanico'] || [];

  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 text-white shadow-strong">
      <div className="flex items-center h-16 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 shadow-medium">
        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
          <Wrench className="h-6 w-6 text-white" />
        </div>
        <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-neutral-100 bg-clip-text text-transparent">
          AutoTaller
        </span>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-2">
        {userNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-medium transform scale-[1.02]'
                  : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white hover:transform hover:scale-[1.01]'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="border-t border-neutral-700 p-4 bg-neutral-800/50">
        <div className="flex items-center mb-4 p-3 bg-neutral-700/30 rounded-xl">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
              <span className="text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-neutral-400 capitalize">{user.rol}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-3 text-sm font-medium text-neutral-300 rounded-xl hover:bg-danger-600/20 hover:text-danger-300 transition-all duration-200 group"
        >
          <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}