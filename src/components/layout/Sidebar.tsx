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
  Wrench
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

const navigation = {
  administrador: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Vehículos', href: '/vehiculos', icon: Car },
    { name: 'Órdenes de Servicio', href: '/ordenes', icon: ClipboardList },
    { name: 'Inventario', href: '/inventario', icon: Package },
    { name: 'Facturación', href: '/facturacion', icon: FileText },
    { name: 'Usuarios', href: '/usuarios', icon: Users },
    { name: 'Configuración', href: '/configuracion', icon: Settings },
  ],
  recepcionista: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Vehículos', href: '/vehiculos', icon: Car },
    { name: 'Órdenes de Servicio', href: '/ordenes', icon: ClipboardList },
    { name: 'Facturación', href: '/facturacion', icon: FileText },
  ],
  mecanico: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mis Órdenes', href: '/mis-ordenes', icon: Wrench },
    { name: 'Inventario', href: '/inventario', icon: Package },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const userNavigation = navigation[user.rol] || [];

  return (
    <aside className="flex flex-col w-64 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white shadow-2xl">
      {/* Logo / Header */}
      <div className="flex items-center h-16 px-4 bg-neutral-800 shadow-inner">
        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
          <Wrench className="h-6 w-6 text-neutral-200" />
        </div>
        <span className="ml-3 text-xl font-extrabold text-white">
          AutoTaller
        </span>
      </div>

      {/* Menú navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {userNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md scale-[1.02]'
                  : 'text-gray-300 hover:bg-neutral-800/60 hover:text-white hover:scale-[1.01]'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Perfil + Logout */}
      <div className="border-t border-neutral-800 p-4 bg-neutral-900/80">
        <div className="flex items-center mb-4 p-3 bg-neutral-800 rounded-xl shadow-inner">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-neutral-700 to-neutral-600 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {user.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">{user.nombre}</p>
            <p className="text-xs text-gray-400 capitalize">{user.rol}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group"
        >
          <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
