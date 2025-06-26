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
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-600">{title}</p>
            <p className="text-3xl font-bold text-neutral-900 mt-1">{value}</p>
            {trend && (
              <div className={`flex items-center mt-3 text-sm font-medium ${
                trend.isPositive ? 'text-success-600' : 'text-danger-600'
              }`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${!trend.isPositive ? 'rotate-180' : ''}`} />
                {trend.value}% vs mes anterior
              </div>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${gradient} shadow-medium`}>
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
          { title: 'Total Órdenes', value: 247, icon: ClipboardList, gradient: 'bg-gradient-to-r from-primary-500 to-primary-600', trend: { value: 12, isPositive: true } },
          { title: 'Ingresos del Mes', value: '$45,230', icon: DollarSign, gradient: 'bg-gradient-to-r from-success-500 to-success-600', trend: { value: 8, isPositive: true } },
          { title: 'Clientes Activos', value: 89, icon: Users, gradient: 'bg-gradient-to-r from-secondary-500 to-secondary-600', trend: { value: 5, isPositive: true } },
          { title: 'Vehículos en Taller', value: 23, icon: Car, gradient: 'bg-gradient-to-r from-accent-500 to-accent-600' },
        ];
      case 'recepcionista':
        return [
          { title: 'Órdenes Pendientes', value: 12, icon: Clock, gradient: 'bg-gradient-to-r from-warning-500 to-warning-600' },
          { title: 'Citas Hoy', value: 8, icon: ClipboardList, gradient: 'bg-gradient-to-r from-primary-500 to-primary-600' },
          { title: 'Nuevos Clientes', value: 3, icon: Users, gradient: 'bg-gradient-to-r from-secondary-500 to-secondary-600' },
          { title: 'Facturas Pendientes', value: 5, icon: DollarSign, gradient: 'bg-gradient-to-r from-danger-500 to-danger-600' },
        ];
      case 'mecanico':
        return [
          { title: 'Mis Órdenes', value: 7, icon: ClipboardList, gradient: 'bg-gradient-to-r from-primary-500 to-primary-600' },
          { title: 'Completadas Hoy', value: 3, icon: CheckCircle, gradient: 'bg-gradient-to-r from-success-500 to-success-600' },
          { title: 'En Proceso', value: 4, icon: Clock, gradient: 'bg-gradient-to-r from-warning-500 to-warning-600' },
          { title: 'Repuestos Solicitados', value: 12, icon: AlertTriangle, gradient: 'bg-gradient-to-r from-danger-500 to-danger-600' },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="text-neutral-600 mt-1">Gestiona tu taller de manera eficiente</p>
        </div>
        <div className="text-sm text-neutral-500 bg-neutral-50 px-4 py-2 rounded-xl">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
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
                <div key={orden.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200 hover:shadow-soft transition-all duration-200">
                  <div>
                    <p className="font-bold text-neutral-900">{orden.id}</p>
                    <p className="text-sm text-neutral-600 mt-1">{orden.cliente} - {orden.vehiculo}</p>
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                    orden.estado === 'Completada' ? 'bg-success-100 text-success-800' :
                    orden.estado === 'En Proceso' ? 'bg-warning-100 text-warning-800' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    {orden.estado}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
              Alertas y Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-danger-50 to-danger-100 rounded-xl border border-danger-200">
                <div className="bg-danger-500 p-2 rounded-xl">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-danger-800">Stock bajo</p>
                  <p className="text-sm text-danger-600 mt-1">Filtro de aceite Toyota - Solo 2 unidades</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-warning-50 to-warning-100 rounded-xl border border-warning-200">
                <div className="bg-warning-500 p-2 rounded-xl">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-warning-800">Orden atrasada</p>
                  <p className="text-sm text-warning-600 mt-1">ORD-045 excede tiempo estimado</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                <div className="bg-primary-500 p-2 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-800">Orden completada</p>
                  <p className="text-sm text-primary-600 mt-1">ORD-098 lista para entrega</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}