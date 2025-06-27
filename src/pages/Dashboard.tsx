import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import {
  Users,
  Car,
  ClipboardList,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon: Icon, gradient, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg rounded-2xl border border-zinc-700 bg-zinc-900 transition-transform hover:scale-[1.01] duration-200">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <p className="text-3xl font-bold text-zinc-100 mt-1">{value}</p>
        {trend && (
          <div
            className={`flex items-center mt-3 text-sm font-semibold ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            <TrendingUp
              className={`h-4 w-4 mr-1 ${!trend.isPositive ? 'rotate-180 transform' : ''}`}
            />
            {trend.value}% vs mes anterior
          </div>
        )}
      </div>
      <div className={`p-4 rounded-xl ${gradient} shadow-md flex items-center justify-center`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
    </div>
  </CardContent>
</Card>

  );
}

export function Dashboard() {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.rol) {
      case 'administrador':
        return [
          {
            title: 'Total Órdenes',
            value: 247,
            icon: ClipboardList,
            gradient: 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 shadow-blue-200',
            trend: { value: 12, isPositive: true },
          },
          {
            title: 'Ingresos del Mes',
            value: '$45,230',
            icon: DollarSign,
            gradient: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400 shadow-green-200',
            trend: { value: 8, isPositive: true },
          },
          {
            title: 'Clientes Activos',
            value: 89,
            icon: Users,
            gradient: 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 shadow-indigo-200',
            trend: { value: 5, isPositive: true },
          },
          {
            title: 'Vehículos en Taller',
            value: 23,
            icon: Car,
            gradient: 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 shadow-purple-200',
          },
        ];

      case 'recepcionista':
        return [
          {
            title: 'Órdenes Pendientes',
            value: 12,
            icon: Clock,
            gradient: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 shadow-yellow-200',
          },
          {
            title: 'Citas Hoy',
            value: 8,
            icon: ClipboardList,
            gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 shadow-blue-200',
          },
          {
            title: 'Nuevos Clientes',
            value: 3,
            icon: Users,
            gradient: 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 shadow-indigo-200',
          },
          {
            title: 'Facturas Pendientes',
            value: 5,
            icon: DollarSign,
            gradient: 'bg-gradient-to-br from-rose-600 via-red-500 to-red-400 shadow-red-200',
          },
        ];

      case 'mecanico':
        return [
          {
            title: 'Mis Órdenes',
            value: 7,
            icon: ClipboardList,
            gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 shadow-blue-200',
          },
          {
            title: 'Completadas Hoy',
            value: 3,
            icon: CheckCircle,
            gradient: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400 shadow-green-200',
          },
          {
            title: 'En Proceso',
            value: 4,
            icon: Clock,
            gradient: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 shadow-yellow-200',
          },
          {
            title: 'Repuestos Solicitados',
            value: 12,
            icon: AlertTriangle,
            gradient: 'bg-gradient-to-br from-rose-600 via-red-500 to-red-400 shadow-red-200',
          },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-10 px-4 sm:px-8 lg:px-16 py-10 bg-gradient-to-br from-zinc-900 to-black min-h-screen">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-400 mt-1 text-base">Gestiona tu taller de manera eficiente</p>
        </div>
        <div className="text-sm font-medium text-zinc-300 bg-zinc-800 px-4 py-2 rounded-full shadow">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-zinc-700 bg-zinc-900 rounded-2xl shadow-md">
          <CardHeader>
      <CardTitle className="flex items-center text-lg font-semibold text-zinc-100">
        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
        Órdenes Recientes
      </CardTitle>
    </CardHeader>
          <CardContent>
      <div className="space-y-4">
        {[
          { id: 'ORD-001', cliente: 'Juan Pérez', vehiculo: 'Toyota Corolla 2020', estado: 'En Proceso' },
          { id: 'ORD-002', cliente: 'María González', vehiculo: 'Honda Civic 2019', estado: 'Completada' },
          { id: 'ORD-003', cliente: 'Carlos López', vehiculo: 'Ford Focus 2021', estado: 'Pendiente' },
        ].map((orden) => (
          <div key={orden.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm hover:shadow-md transition duration-200">
            <div>
              <p className="font-bold text-zinc-100">{orden.id}</p>
              <p className="text-sm text-zinc-400 mt-1">{orden.cliente} - {orden.vehiculo}</p>
            </div>
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
              orden.estado === 'Completada'
                ? 'bg-emerald-900 text-emerald-300'
                : orden.estado === 'En Proceso'
                  ? 'bg-yellow-900 text-yellow-300'
                  : 'bg-zinc-700 text-zinc-300'
            }`}>
              {orden.estado}
            </span>
          </div>
        ))}
      </div>
    </CardContent>
        </Card>

          <Card className="border border-zinc-700 bg-zinc-900 rounded-2xl shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center text-lg font-semibold text-zinc-100">
        <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
        Alertas y Notificaciones
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-start space-x-4 p-4 bg-red-900 rounded-xl border-l-4 border-red-600 shadow-sm">
          <div className="bg-red-600 p-2 rounded-xl">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-300">Stock bajo</p>
            <p className="text-sm text-red-400 mt-1">Filtro de aceite Toyota - Solo 2 unidades</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-yellow-900 rounded-xl border-l-4 border-yellow-500 shadow-sm">
          <div className="bg-yellow-500 p-2 rounded-xl">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-yellow-300">Orden atrasada</p>
            <p className="text-sm text-yellow-400 mt-1">ORD-045 excede tiempo estimado</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-blue-900 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <div className="bg-blue-500 p-2 rounded-xl">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-300">Orden completada</p>
            <p className="text-sm text-blue-400 mt-1">ORD-098 lista para entrega</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
      </div>
    </div>
  );
}
