import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Search, Clock, CheckCircle, AlertTriangle, Play, Pause, FileText } from 'lucide-react';
import { OrdenServicio, Cliente, Vehiculo, User, EstadoOrden } from '../types';

// Mock data para mecánico
const mockOrdenesMecanico: (OrdenServicio & { cliente: Cliente; vehiculo: Vehiculo })[] = [
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
    cliente: { id: '1', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com', telefono: '+1234567890', direccion: 'Calle 123 #45-67', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
    vehiculo: { id: '1', clienteId: '1', marca: 'Toyota', modelo: 'Corolla', año: 2020, placa: 'ABC-123', vin: '1HGBH41JXMN109186', color: 'Blanco', kilometraje: 45000, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'ORD-003',
    clienteId: '3',
    vehiculoId: '3',
    mecanicoId: '3',
    descripcion: 'Diagnóstico y reparación de sistema eléctrico.',
    estado: 'pendiente',
    fechaIngreso: '2024-01-21T09:00:00Z',
    fechaEstimada: '2024-01-22T17:00:00Z',
    costoManoObra: 300000,
    costoRepuestos: 150000,
    costoTotal: 450000,
    cliente: { id: '3', nombre: 'Carlos', apellido: 'López', email: 'carlos.lopez@email.com', telefono: '+1234567892', direccion: 'Carrera 789 #12-34', createdAt: '2024-01-17T09:45:00Z', updatedAt: '2024-01-17T09:45:00Z' },
    vehiculo: { id: '3', clienteId: '3', marca: 'Ford', modelo: 'Focus', año: 2021, placa: 'GHI-789', vin: '1FADP3F20FL123456', color: 'Azul', kilometraje: 28000, createdAt: '2024-01-17T09:45:00Z', updatedAt: '2024-01-17T09:45:00Z' },
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T09:00:00Z',
  },
];

const estadoConfig = {
  pendiente: { icon: Clock, color: 'text-warning-600', bg: 'bg-warning-100', label: 'Pendiente' },
  en_proceso: { icon: AlertTriangle, color: 'text-primary-600', bg: 'bg-primary-100', label: 'En Proceso' },
  completada: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100', label: 'Completada' },
};

export function MisOrdenes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<EstadoOrden | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenServicio | null>(null);

  const filteredOrdenes = mockOrdenesMecanico.filter(orden =>
    (orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     orden.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     orden.vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterEstado === '' || orden.estado === filterEstado)
  );

  const getEstadoStats = () => {
    return {
      total: mockOrdenesMecanico.length,
      pendiente: mockOrdenesMecanico.filter(o => o.estado === 'pendiente').length,
      en_proceso: mockOrdenesMecanico.filter(o => o.estado === 'en_proceso').length,
      completada: mockOrdenesMecanico.filter(o => o.estado === 'completada').length,
    };
  };

  const stats = getEstadoStats();

  const handleIniciarTrabajo = (orden: OrdenServicio) => {
    // Lógica para iniciar trabajo
    console.log('Iniciando trabajo en orden:', orden.id);
  };

  const handlePausarTrabajo = (orden: OrdenServicio) => {
    // Lógica para pausar trabajo
    console.log('Pausando trabajo en orden:', orden.id);
  };

  const handleCompletarTrabajo = (orden: OrdenServicio) => {
    // Lógica para completar trabajo
    console.log('Completando trabajo en orden:', orden.id);
  };

  const handleVerDetalle = (orden: OrdenServicio) => {
    setSelectedOrden(orden);
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Mis Órdenes de Trabajo
          </h1>
          <p className="text-neutral-600 mt-1">Gestiona tus órdenes asignadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Mis Órdenes</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-500 to-neutral-600 shadow-medium">
                <FileText className="h-7 w-7 text-white" />
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
              Órdenes Asignadas
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value as EstadoOrden | '')}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completada">Completada</option>
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
          <div className="space-y-4">
            {filteredOrdenes.map((orden) => {
              const EstadoIcon = estadoConfig[orden.estado].icon;
              return (
                <div key={orden.id} className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200 hover:shadow-medium transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900">{orden.id}</h3>
                        <p className="text-sm text-neutral-600">
                          {orden.cliente.nombre} {orden.cliente.apellido} • {orden.vehiculo.marca} {orden.vehiculo.modelo}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${estadoConfig[orden.estado].bg} ${estadoConfig[orden.estado].color}`}>
                      <EstadoIcon className="h-3 w-3 mr-1" />
                      {estadoConfig[orden.estado].label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-neutral-700">Descripción:</p>
                      <p className="text-sm text-neutral-600">{orden.descripcion}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-700">Fecha Estimada:</p>
                      <p className="text-sm text-neutral-600">
                        {orden.fechaEstimada ? new Date(orden.fechaEstimada).toLocaleString('es-ES') : 'No definida'}
                      </p>
                    </div>
                  </div>

                  {orden.observaciones && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-neutral-700">Observaciones:</p>
                      <p className="text-sm text-neutral-600">{orden.observaciones}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <div className="text-sm">
                      <span className="font-semibold text-neutral-700">Total: </span>
                      <span className="font-bold text-lg text-neutral-900">${orden.costoTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleVerDetalle(orden)}>
                        Ver Detalle
                      </Button>
                      {orden.estado === 'pendiente' && (
                        <Button size="sm" onClick={() => handleIniciarTrabajo(orden)}>
                          <Play className="h-4 w-4 mr-1" />
                          Iniciar
                        </Button>
                      )}
                      {orden.estado === 'en_proceso' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handlePausarTrabajo(orden)}>
                            <Pause className="h-4 w-4 mr-1" />
                            Pausar
                          </Button>
                          <Button variant="success" size="sm" onClick={() => handleCompletarTrabajo(orden)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalle */}
      {showModal && selectedOrden && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              Detalle de Orden - {selectedOrden.id}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-2">Información del Cliente</h3>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="font-semibold">{selectedOrden.cliente.nombre} {selectedOrden.cliente.apellido}</p>
                    <p className="text-sm text-neutral-600">{selectedOrden.cliente.email}</p>
                    <p className="text-sm text-neutral-600">{selectedOrden.cliente.telefono}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-2">Información del Vehículo</h3>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="font-semibold">{selectedOrden.vehiculo.marca} {selectedOrden.vehiculo.modelo}</p>
                    <p className="text-sm text-neutral-600">Año: {selectedOrden.vehiculo.año}</p>
                    <p className="text-sm text-neutral-600">Placa: {selectedOrden.vehiculo.placa}</p>
                    <p className="text-sm text-neutral-600">Color: {selectedOrden.vehiculo.color}</p>
                    <p className="text-sm text-neutral-600">Kilometraje: {selectedOrden.vehiculo.kilometraje.toLocaleString()} km</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-2">Detalles del Servicio</h3>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="text-sm text-neutral-600 mb-2">
                      <span className="font-semibold">Fecha Ingreso:</span> {new Date(selectedOrden.fechaIngreso).toLocaleString('es-ES')}
                    </p>
                    {selectedOrden.fechaEstimada && (
                      <p className="text-sm text-neutral-600 mb-2">
                        <span className="font-semibold">Fecha Estimada:</span> {new Date(selectedOrden.fechaEstimada).toLocaleString('es-ES')}
                      </p>
                    )}
                    <p className="text-sm text-neutral-600">
                      <span className="font-semibold">Estado:</span> {estadoConfig[selectedOrden.estado].label}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-2">Costos</h3>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-neutral-600">Mano de Obra:</span>
                      <span className="text-sm font-semibold">${selectedOrden.costoManoObra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-neutral-600">Repuestos:</span>
                      <span className="text-sm font-semibold">${selectedOrden.costoRepuestos.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">${selectedOrden.costoTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-700 mb-2">Descripción del Trabajo</h3>
              <div className="bg-neutral-50 p-4 rounded-xl">
                <p className="text-sm text-neutral-700">{selectedOrden.descripcion}</p>
              </div>
            </div>
            
            {selectedOrden.observaciones && (
              <div className="mb-6">
                <h3 className="font-semibold text-neutral-700 mb-2">Observaciones</h3>
                <div className="bg-neutral-50 p-4 rounded-xl">
                  <p className="text-sm text-neutral-700">{selectedOrden.observaciones}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              {selectedOrden.estado === 'pendiente' && (
                <Button onClick={() => { handleIniciarTrabajo(selectedOrden); setShowModal(false); }}>
                  <Play className="h-4 w-4 mr-1" />
                  Iniciar Trabajo
                </Button>
              )}
              {selectedOrden.estado === 'en_proceso' && (
                <Button variant="success" onClick={() => { handleCompletarTrabajo(selectedOrden); setShowModal(false); }}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completar Trabajo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}