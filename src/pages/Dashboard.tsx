import React, { useState, useEffect } from 'react';
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
import { getServiceOrder } from '../Apis/ServiceOrder';
import type { ServiceOrder, Invoice, Client, Vehicle, State, Diagnostic, SparePart } from '../types';
import { getInvoice } from '../Apis/InvoiceApis';
import { getClient } from '../Apis/ClientApis';
import { getVehicle } from '../Apis/vehiclesApis';
import { getState } from '../Apis/StateApi';
import { getDiagnostic } from '../Apis/DiagnosticApis';
import { getSpareParts } from '../Apis/SparePartApis';


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

function StatCard({ title, value, icon: Icon, gradient}: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg rounded-2xl border border-zinc-700 bg-zinc-900 transition-transform hover:scale-[1.01] duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
        <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <p className="text-3xl font-bold text-zinc-100 mt-1">{value}</p>
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
  const [ordenes, setOrdenes] = useState<ServiceOrder[]>([]);
  const [facturas, setFacturas] = useState<Invoice[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [estados, setStates] = useState<State[]>([]);
  const [diagnosticos, setDiagnostico] = useState<Diagnostic[]>([]);
  const [repuestos, setRepuestos] = useState<SparePart[]>([]);
  useEffect(() => {
      getServiceOrder().then((data) => {
        if (data) setOrdenes(data);
      });
    }, []);

  useEffect(() => {
      getInvoice().then((data) => {
        if (data) setFacturas(data);
      });
    }, []);

  useEffect(() => {
    getClient().then((data) => {
      if (data) setClientes(data);
    });
  }, []);

  useEffect(() => {
    getVehicle().then((data) => {
      if (data) setVehiculos(data);
    });
  }, []);

  useEffect(() => {
    getState().then((data) => {
      if (data) setStates(data);
    });
  }, []);

  useEffect(() => {
    getDiagnostic().then((data) => {
      if (data) setDiagnostico(data);
    });
  }, []);

  useEffect(() => {
    getSpareParts().then((data) => {
      if (data) setRepuestos(data);
    });
  }, []);

  const getOrdenesEnProceso = () => {
    return ordenes.filter(orden => {
      const estado = estados.find(e => e.id === orden.stateId);
      return estado && (estado.name.toLowerCase().includes('proceso') || 
                      estado.name.toLowerCase().includes('trabajando') ||
                      estado.name.toLowerCase().includes('reparando'));
    }).length;
  };

  const getOrdenesCompletadas = () => {
    return ordenes.filter(orden => {
      const estado = estados.find(e => e.id === orden.stateId);
      return estado && (estado.name.toLowerCase().includes('completada') || 
                      estado.name.toLowerCase().includes('terminada') ||
                      estado.name.toLowerCase().includes('finalizada'));
    }).length;
  };

  const getOrdenesPendientes = () => {
    return ordenes.filter(orden => {
      const estado = estados.find(e => e.id === orden.stateId);
      return estado && (estado.name.toLowerCase().includes('pendiente') || 
                      estado.name.toLowerCase().includes('espera') ||
                      estado.name.toLowerCase().includes('nueva'));
    }).length;
  };

  const getStats = () => {
    const totalOrdenes = ordenes.length;
    const totalFacturas = facturas.length;
    const totalClientes = clientes.length;
    const totalVehicles = vehiculos.length;
    const totalDiagnosticos = diagnosticos.length;
    
    return { totalOrdenes, totalFacturas, totalClientes, totalVehicles, totalDiagnosticos };
  };

  const stat = getStats();

  const getStatsForRole = () => {
    switch (user?.rol) {
      case 'administrador':
        return [
          {
            title: 'Total Órdenes',
            value: stat.totalOrdenes,
            icon: ClipboardList,
            gradient: 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 shadow-blue-200'
          },
          {
            title: 'Facturas',
            value: stat.totalFacturas,
            icon: DollarSign,
            gradient: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400 shadow-green-200'
          },
          {
            title: 'Clientes Activos',
            value: stat.totalClientes,
            icon: Users,
            gradient: 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 shadow-indigo-200'
          },
          {
            title: 'Vehículos',
            value: stat.totalVehicles,
            icon: Car,
            gradient: 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 shadow-purple-200'
          },
        ];

      case 'recepcionista':
        return [
          {
            title: 'Órdenes Pendientes',
            value: getOrdenesPendientes(),
            icon: Clock,
            gradient: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 shadow-yellow-200'
          },
          {
            title: 'Diagnósticos',
            value: stat.totalDiagnosticos,
            icon: ClipboardList,
            gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 shadow-blue-200',
          },
          {
            title: 'Clientes',
            value: stat.totalClientes,
            icon: Users,
            gradient: 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 shadow-indigo-200',
          },
          {
            title: 'Facturas',
            value: stat.totalFacturas,
            icon: DollarSign,
            gradient: 'bg-gradient-to-br from-rose-600 via-red-500 to-red-400 shadow-red-200',
          },
        ];

      case 'mecanico':
        return [
          {
            title: 'Órdenes Pendientes',
            value: getOrdenesPendientes(),
            icon: ClipboardList,
            gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 shadow-blue-200',
          },
          {
            title: 'Ordenes Completadas',
            value: getOrdenesCompletadas(),
            icon: CheckCircle,
            gradient: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400 shadow-green-200',
          },
          {
            title: 'Órdenes en Proceso',
            value: getOrdenesEnProceso(),
            icon: Clock,
            gradient: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 shadow-yellow-200',
          },
          {
            title: 'Facturas',
            value: stat.totalFacturas,
            icon: AlertTriangle,
            gradient: 'bg-gradient-to-br from-rose-600 via-red-500 to-red-400 shadow-red-200',
          },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  // Obtener las órdenes recientes de la base de datos
  const getRecentOrders = () => {
    // Ordena por fecha de entrada descendente (o por id si no tienes fecha)
    const sorted = [...ordenes].sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
    return sorted.slice(0, 3).map(orden => {
      const vehicle = vehiculos.find(v => v.id === orden.vehiclesId);
      const client = vehicle ? clientes.find(c => c.id === vehicle.clientId) : undefined;
      const estado = estados.find(e => e.id === orden.stateId)?.name || 'Pendiente';
      return {
        id: orden.id,
        entryDate: orden.entryDate,
        cliente: client ? `${client.name} ${client.lastName}` : 'N/A',
        vehiculo: vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.vin || ''}` : 'N/A',
        estado
      };
    });
  };

  // Obtener los tres repuestos con menor stock
  const getLowStockSpareParts = () => {
    return [...repuestos]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 3);
  };

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
         {getRecentOrders().map((orden) => (
          <div key={orden.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm hover:shadow-md transition duration-200">
            <div>
              <p className="font-bold text-zinc-100">{orden.id} {orden.entryDate}</p>
              <p className="text-sm text-zinc-400 mt-1">{orden.cliente} - {orden.vehiculo}</p>
            </div>
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
              orden.estado.toLowerCase().includes('completada')
                ? 'bg-emerald-900 text-emerald-300'
                : orden.estado.toLowerCase().includes('proceso')
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
        Alertas Stock
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {getLowStockSpareParts().map((repuesto) => (
        <div key={repuesto.id} className="flex items-start space-x-4 p-4 bg-red-900 rounded-xl border-l-4 border-red-600 shadow-sm">
          <div className="bg-red-600 p-2 rounded-xl">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-300">Stock</p>
            <p className="text-sm text-red-400 mt-1">{repuesto.description} - {repuesto.stock} unidades</p>
          </div>
        </div>
        ))}
      </div>
    </CardContent>
  </Card>
      </div>
    </div>
  );
}
