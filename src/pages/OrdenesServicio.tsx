import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Eye, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { OrdenServicio, Cliente, Vehiculo, User, EstadoOrden } from '../types';

// Mock data
const mockClientes: Cliente[] = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com', telefono: '+1234567890', direccion: 'Calle 123 #45-67', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  { id: '2', nombre: 'María', apellido: 'González', email: 'maria.gonzalez@email.com', telefono: '+1234567891', direccion: 'Avenida 456 #78-90', createdAt: '2024-01-16T11:15:00Z', updatedAt: '2024-01-16T11:15:00Z' },
];

const mockVehiculos: Vehiculo[] = [
  { id: '1', clienteId: '1', marca: 'Toyota', modelo: 'Corolla', año: 2020, placa: 'ABC-123', vin: '1HGBH41JXMN109186', color: 'Blanco', kilometraje: 45000, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  { id: '2', clienteId: '2', marca: 'Honda', modelo: 'Civic', año: 2019, placa: 'DEF-456', vin: '2HGFC2F59JH123456', color: 'Negro', kilometraje: 62000, createdAt: '2024-01-16T11:15:00Z', updatedAt: '2024-01-16T11:15:00Z' },
];

const mockMecanicos: User[] = [
  { id: '3', nombre: 'Carlos Rodríguez', email: 'carlos@taller.com', telefono: '+1234567892', rol: 'mecanico', activo: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '4', nombre: 'Ana Martínez', email: 'ana@taller.com', telefono: '+1234567893', rol: 'mecanico', activo: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

const mockOrdenes: (OrdenServicio & { cliente: Cliente; vehiculo: Vehiculo; mecanico: User })[] = [
  {
    id: 'ORD-001',
    clienteId: '1',
    vehiculoId: '1',
    mecanicoId: '3',
    descripcion: 'Cambio de aceite y filtros. Revisión general del motor.',
    estado: 'en_proceso',
    fechaIngreso: '2024-01-20T08:00:00Z',
    fechaEstimada: '2024-01-20T16:00:00Z',
    costoManoObra: 150000,
    costoRepuestos: 85000,
    costoTotal: 235000,
    observaciones: 'Cliente solicita aceite sintético',
    cliente: mockClientes[0],
    vehiculo: mockVehiculos[0],
    mecanico: mockMecanicos[0],
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'ORD-002',
    clienteId: '2',
    vehiculoId: '2',
    mecanicoId: '4',
    descripcion: 'Reparación de frenos delanteros y traseros.',
    estado: 'completada',
    fechaIngreso: '2024-01-19T09:00:00Z',
    fechaEstimada: '2024-01-19T17:00:00Z',
    fechaEntrega: '2024-01-19T16:30:00Z',
    costoManoObra: 200000,
    costoRepuestos: 320000,
    costoTotal: 520000,
    cliente: mockClientes[1],
    vehiculo: mockVehiculos[1],
    mecanico: mockMecanicos[1],
    createdAt: '2024-01-19T09:00:00Z',
    updatedAt: '2024-01-19T16:30:00Z',
  },
];

const estadoConfig = {
  pendiente: { icon: Clock, color: 'text-warning-600', bg: 'bg-warning-100', label: 'Pendiente' },
  en_proceso: { icon: AlertTriangle, color: 'text-primary-600', bg: 'bg-primary-100', label: 'En Proceso' },
  completada: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100', label: 'Completada' },
  cancelada: { icon: XCircle, color: 'text-danger-600', bg: 'bg-danger-100', label: 'Cancelada' },
};

export function OrdenesServicio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenServicio | null>(null);
  const [filterEstado, setFilterEstado] = useState<EstadoOrden | ''>('');

  const filteredOrdenes = mockOrdenes.filter(orden =>
    (orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     orden.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     orden.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
     orden.vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
     orden.vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterEstado === '' || orden.estado === filterEstado)
  );

  const handleEdit = (orden: OrdenServicio) => {
    setSelectedOrden(orden);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedOrden(null);
    setShowModal(true);
  };

  const getEstadoStats = () => {
    const stats = {
      total: mockOrdenes.length,
      pendiente: mockOrdenes.filter(o => o.estado === 'pendiente').length,
      en_proceso: mockOrdenes.filter(o => o.estado === 'en_proceso').length,
      completada: mockOrdenes.filter(o => o.estado === 'completada').length,
    };
    return stats;
  };

  const stats = getEstadoStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Órdenes de Servicio
          </h1>
          <p className="text-neutral-600 mt-1">Gestiona las órdenes de trabajo del taller</p>
        </div>
        <Button onClick={handleCreate} className="shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Total Órdenes</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-500 to-neutral-600 shadow-medium">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">En Proceso</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.en_proceso}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-medium">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Completadas</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.completada}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-success-500 to-success-600 shadow-medium">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Pendientes</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.pendiente}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-warning-500 to-warning-600 shadow-medium">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Lista de Órdenes
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value as EstadoOrden | '')}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </Select>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar órdenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Cliente / Vehículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Mecánico
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredOrdenes.map((orden) => {
                  const EstadoIcon = estadoConfig[orden.estado].icon;
                  return (
                    <tr key={orden.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-neutral-900">{orden.id}</div>
                          <div className="text-sm text-neutral-500">
                            {new Date(orden.fechaIngreso).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-neutral-900">
                            {orden.cliente.nombre} {orden.cliente.apellido}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {orden.vehiculo.marca} {orden.vehiculo.modelo} • {orden.vehiculo.placa}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{orden.mecanico.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${estadoConfig[orden.estado].bg} ${estadoConfig[orden.estado].color}`}>
                          <EstadoIcon className="h-3 w-3 mr-1" />
                          {estadoConfig[orden.estado].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-neutral-900">
                          ${orden.costoTotal.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="hover:bg-accent-50 hover:text-accent-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(orden)} className="hover:bg-primary-50 hover:text-primary-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {selectedOrden ? 'Editar Orden de Servicio' : 'Nueva Orden de Servicio'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select label="Cliente" defaultValue={selectedOrden?.clienteId}>
                  <option value="">Seleccionar cliente</option>
                  {mockClientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </Select>
                <Select label="Vehículo" defaultValue={selectedOrden?.vehiculoId}>
                  <option value="">Seleccionar vehículo</option>
                  {mockVehiculos.map(vehiculo => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                    </option>
                  ))}
                </Select>
                <Select label="Mecánico" defaultValue={selectedOrden?.mecanicoId}>
                  <option value="">Asignar mecánico</option>
                  {mockMecanicos.map(mecanico => (
                    <option key={mecanico.id} value={mecanico.id}>
                      {mecanico.nombre}
                    </option>
                  ))}
                </Select>
                <Select label="Estado" defaultValue={selectedOrden?.estado}>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </Select>
              </div>
              <div className="space-y-4">
                <Input label="Fecha Estimada" type="datetime-local" defaultValue={selectedOrden?.fechaEstimada?.slice(0, 16)} />
                <Input label="Costo Mano de Obra" type="number" defaultValue={selectedOrden?.costoManoObra} />
                <Input label="Costo Repuestos" type="number" defaultValue={selectedOrden?.costoRepuestos} />
                <Input label="Costo Total" type="number" defaultValue={selectedOrden?.costoTotal} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Descripción del Servicio</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl shadow-soft placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                  rows={3}
                  defaultValue={selectedOrden?.descripcion}
                  placeholder="Describe los servicios a realizar..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Observaciones</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl shadow-soft placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                  rows={2}
                  defaultValue={selectedOrden?.observaciones}
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowModal(false)}>
                {selectedOrden ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}